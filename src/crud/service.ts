import {
  DocumentType as Doc,
  getModelForClass,
  getName,
} from '@typegoose/typegoose';
import mongoose, { Query } from 'mongoose';

import { ObjectId, Model, ModelClass, CorrespondingEdge } from '../utils/utils';
import { checkUpdateResult, documentNotFound, ClientError } from '../utils/err';

/* eslint { @typescript-eslint/explicit-function-return-type: "error" } */

// merging

function stripField(field: string): string {
  return field.startsWith('+') || field.startsWith('-')
    ? field.substring(1)
    : field;
}

function calculateSortPriorities(base: string[], override: string[]): string[] {
  let overrideNames = new Set(override.map(stripField));
  let baseList = base.filter(
    (field) => !overrideNames.has(stripField(field))
  );
  return override.concat(baseList);
}

function calculateSelectedFields(base: string[], override: string[]): string[] {
  if (!override.length) return base;
  let exclude = override[0].startsWith('-');
  if (exclude) override = override.map((x) => x.substring(1));
  return base.filter((x) => exclude !== base.some((y) => x.startsWith(y)));
}

// flattening

function flattenFields(
  modelClass: ModelClass,
  computeLevel: (modelClass: ModelClass) => string[]
): string[] {
  let result = computeLevel(modelClass);
  let subdocFields = modelClass.getSubdocumentFieldMap();
  Object.assign(subdocFields, modelClass.getSubcollectionFieldMap());
  for (let field of Object.keys(subdocFields)) {
    result.push(
      ...flattenFields(subdocFields[field], computeLevel).map(
        (x) => field + '.' + x
      )
    );
  }
  return result;
}

function flattenFieldMap<T>(
  modelClass: ModelClass,
  computeLevel: (modelClass: ModelClass) => Record<string, T>
): Map<string, T> {
  let result = new Map(Object.entries(computeLevel(modelClass)));
  let subdocFields = modelClass.getSubdocumentFieldMap();
  Object.assign(subdocFields, modelClass.getSubcollectionFieldMap());
  for (let field of Object.keys(subdocFields)) {
    let subResult = flattenFieldMap(subdocFields[field], computeLevel);
    for (let [subField, value] of subResult)
      result.set(field + '.' + subField, value);
  }
  return result;
}

// document operations

export async function processGet(
  model: Model<unknown>,
  query: Query<Doc<unknown> | null, Doc<unknown>>,
  select: string[]
): Promise<Doc<unknown> | null> {
  let simpleFields = flattenFields(model, (model) => model.getSimpleFields());
  let singleEdgeFields = flattenFieldMap(model, (model) =>
    model.getSingleEdgeFieldMap()
  );
  select = calculateSelectedFields(
    simpleFields.concat(...singleEdgeFields.keys()),
    select
  );

  query = query.select(select);

  let selectSet = new Set(select);
  for (let [field, target] of singleEdgeFields) {
    if (selectSet.has(field))
      query = query.populate(
        field,
        flattenFields(target.model, (model) => model.getSimpleFields())
      );
  }

  return await query.exec();
}

export async function getDocByEmail(
  model: Model<unknown>,
  email: string,
  select: string[]
): Promise<Doc<unknown>> {
  let doc = await processGet(model, model.findOne({ email: email }), select);
  if (!doc)
    throw new ClientError(
      404,
      `document of type "${getName(
        model
      )}" with email "${email}" not found`
    );
  return doc;
}

export async function getDoc(
  model: Model<unknown>,
  id: ObjectId,
  select: string[]
): Promise<Doc<unknown>> {
  let doc = await processGet(model, model.findById(id), select);
  if (!doc) throw documentNotFound(model, id);
  return doc;
}

function getOrEmptyArray<K, V>(map: Map<K, V[]>, key: K): V[] {
  if (!map.has(key)) map.set(key, []);
  return map.get(key)!;
}

// validating this is gonna be hell
// best of luck to future me :')
export async function setDoc(
  model: Model<unknown>,
  id: ObjectId,
  // assume ObjectIds have already been cast
  obj: Record<string, any>
): Promise<void> {
  //
  // variables
  //

  // field maps
  let subcollectionFieldMap = flattenFieldMap(model, (x) =>
    x.getSubcollectionFieldMap()
  );
  let multiEdgeFieldMap = flattenFieldMap(model, (x) =>
    x.getMultiEdgeFieldMap()
  );
  let singleEdgeFieldMap = flattenFieldMap(model, (x) =>
    x.getSingleEdgeFieldMap()
  );
  let edgeFieldMap = new Map([...multiEdgeFieldMap, ...singleEdgeFieldMap]);

  // simple
  let setQueries: Map<string, any> = new Map();

  // multi edge
  let multiEdgeRemoveQueries: Map<string, ObjectId[]> = new Map();
  let multiEdgeAddQueries: Map<string, ObjectId[]> = new Map();

  // subdoc
  let subdocRemoveQueries: Map<string, ObjectId[]> = new Map();
  let subdocAddQueries: Map<string, any> = new Map();

  // edge synchronization
  let syncedEdgeAdds: Map<string, ObjectId[]> = new Map();
  let syncedEdgeRemoves: Map<string, ObjectId[]> = new Map();

  // positional id mapping
  let idMap = new Map<ObjectId, number>();
  let idList = [];

  //
  // sort all the operations
  //

  for (let field of Object.keys(obj)) {
    let split = field.split('.');
    let plainFieldName = '';
    let positionalFieldName = '';

    let edgeId;
    let subdocId;
    let pathIds: ObjectId[] = [];
    for (let i = 0; i < split.length; i++) {
      let part = (plainFieldName === '' ? '' : '.') + split[i];
      plainFieldName += part;
      positionalFieldName += part;

      if (subcollectionFieldMap.has(plainFieldName)) {
        // create new subdoc
        if (i + 1 < split.length - 1 && split[i + 1] == '_') continue;

        let id = ObjectId(split[i + 1]);
        let index = idMap.get(id);
        if (index === undefined) {
          index = idList.length;
          idMap.set(id, index);
          idList.push(id);
        }
        if (i + 1 < split.length - 1) {
          pathIds.push(id);
          positionalFieldName += `.$[id${index}]`;
        } else {
          subdocId = id;
        }
        i++;
      } else if (multiEdgeFieldMap.has(plainFieldName)) {
        edgeId = ObjectId(split[i + 1]);
        i++;
        // should be the end of the loop
      }
    }

    if (edgeId && multiEdgeFieldMap.has(plainFieldName)) {
      // setting a specific edge
      let edgeQueries = obj[field]
        ? multiEdgeAddQueries
        : multiEdgeRemoveQueries;
      getOrEmptyArray(edgeQueries, positionalFieldName).push(edgeId);

      let syncedEdges = obj[field] ? syncedEdgeAdds : syncedEdgeRemoves;
      if (multiEdgeFieldMap.get(plainFieldName)!.target)
        getOrEmptyArray(syncedEdges, plainFieldName).push(edgeId);
    } else if (subcollectionFieldMap.has(plainFieldName)) {
      if (subdocId) {
        // always remove unless its guaranteed to be an insertion
        // this forces uniqueness for a single id
        getOrEmptyArray(subdocRemoveQueries, positionalFieldName).push(
          subdocId
        );
      }
      // if it's not a remove query, we're adding or setting
      if (obj[field] !== false) {
        subdocAddQueries.set(
          positionalFieldName,
          Object.assign(obj[field], { _id: subdocId ?? ObjectId() })
        );
      }
    } else {
      setQueries.set(positionalFieldName, obj[field]);
    }
  }

  //
  // diff replaced edges for synchronization
  //

  let replaceSingle = [];
  let replaceMulti = [];
  for (let fieldName of setQueries.keys()) {
    let single = singleEdgeFieldMap.get(fieldName);
    let multi = multiEdgeFieldMap.get(fieldName);
    if (single && single.target) replaceSingle.push(fieldName);
    if (multi && multi.target) replaceMulti.push(fieldName);
  }
  // TODO: synchronization issues?
  let doc: any = await model
    .findById(id)
    .select(replaceSingle.concat(replaceMulti).join(' '))
    .exec();
  if (!doc) throw documentNotFound(model, id);
  for (let single of replaceSingle) {
    if (doc[single]) syncedEdgeRemoves.set(single, [doc[single]]);
    syncedEdgeAdds.set(single, [obj[single]]);
  }
  for (let multi of replaceMulti) {
    syncedEdgeRemoves.set(multi, doc[multi]);
    syncedEdgeAdds.set(multi, obj[multi]);
  }

  //
  // do all the operations
  //

  let arrayFilters = Object.fromEntries(
    idList.map((id, index) => [`id${index}`, id])
  );

  let write: any[] = [];
  let targetWrites: Map<ModelClass, any[]> = new Map();

  // sync edges

  for (let edgeOps of [syncedEdgeRemoves, syncedEdgeAdds]) {
    let remove = edgeOps === syncedEdgeRemoves;
    for (let [field, ids] of edgeOps) {
      let edge = edgeFieldMap.get(field)!;
      let targetWrite = getOrEmptyArray(targetWrites, edge.model);
      let op = edge.targetMulti
        ? remove
          ? '$pull'
          : '$addToSet'
        : '$set';
      let value = !edge.targetMulti && remove ? null : id;
      targetWrite.push({
        updateMany: {
          filter: { _id: { $in: ids } },
          update: { [op]: value },
        },
      });
    }
  }

  // operate on our doc

  function pushWrite(query: any): void {
    write.push({
      updateOne: {
        filter: { _id: id },
        update: query,
        arrayFilters: arrayFilters,
      },
    });
  }

  // multi edge ops
  for (let multiEdgeOps of [multiEdgeRemoveQueries, multiEdgeAddQueries]) {
    let remove = multiEdgeOps === multiEdgeRemoveQueries;
    let op = remove ? '$pull' : '$addToSet';
    let query: Record<string, any> = { [op]: {} };
    for (let [field, ids] of multiEdgeOps) {
      query[op][field] = remove ? { $in: ids } : { $each: ids };
    }
    pushWrite(query);
  }

  // subdoc removes
  {
    let query: Record<string, any> = { $pull: {} };
    for (let [field, ids] of subdocRemoveQueries) {
      query['$pull'][field] = { _id: { $in: ids } };
    }
    pushWrite(query);
  }
  // subdoc inserts
  {
    let query: Record<string, any> = { $push: {} };
    for (let [field, ids] of subdocAddQueries) {
      query['$push'][field] = { $each: ids };
    }
    pushWrite(query);
  }

  pushWrite({
    $set: Object.fromEntries(setQueries)
  });

  const session = await mongoose.startSession();
  await session.withTransaction(async (session) => {
    for (let [modelClass, targetWrite] of targetWrites) {
      let targetModel: Model<unknown> = getModelForClass(modelClass as any);
      await targetModel.bulkWrite(targetWrite, { session: session });
    }
    await model.bulkWrite(write, { session: session });
  });
  session.endSession();
}

export async function createDoc(
  model: Model<unknown>,
  obj: unknown
): Promise<Doc<unknown>> {
  return await model.build(obj);
}

export async function removeDoc(
  model: Model<unknown>,
  id: ObjectId
): Promise<void> {
  let result = await model.deleteOne({ _id: id }).exec();
  if (result.n! < 1) throw documentNotFound(model, id);
}

// graph operations

function traverse(
  sourcePath: string[],
  doc: any, // either a document or subdocument array
  subIds: (ObjectId | string)[],
  pathIndex = 0,
  idIndex = 0
): [ObjectId[][], ObjectId[][]] {
  for (; pathIndex < sourcePath.length; pathIndex++) {
    if (sourcePath[pathIndex] === '_') {
      if (subIds[idIndex] == 'all') {
        let paths = [];
        let idLists = [];
        for (let subdoc of doc) {
          let [subPaths, subIdLists] = traverse(
            sourcePath,
            subdoc,
            subIds,
            pathIndex + 1,
            idIndex + 1
          );
          for (let path of subPaths) path.push(subdoc._id);
          paths.push(...subPaths);
          idLists.push(...subIdLists);
        }
        return [paths, idLists];
      } else {
        doc = doc.id(subIds[idIndex]);
        if (!doc)
          throw new ClientError(
            400,
            `subdocument with id "${subIds[idIndex]}" not found`
          );
        idIndex++;
      }
    } else {
      doc = doc[sourcePath[pathIndex]];
    }
  }
  return [[], doc];
}

export async function getEdges(
  sourceModel: Model<unknown>,
  sourcePath: string[],
  targetModel: Model<unknown>,
  sourceId: ObjectId,
  subIds: (ObjectId | string)[],
  sort: string[],
  select: string[],
  start: number,
  count: number
): Promise<Doc<unknown>[]> {
  let doc: any = await sourceModel
    .findById(sourceId)
    .select(sourcePath.filter((x) => x !== '_').join('.'))
    .exec();
  if (!doc) throw documentNotFound(sourceModel, sourceId);

  let [paths, idLists] = traverse(sourcePath, doc, subIds);
  for (let path of paths) path.reverse();
  let idList = Array.prototype.concat(...idLists);

  let singleEdgeFields = flattenFieldMap(targetModel, (model) =>
    model.getSingleEdgeFieldMap()
  );
  let selectedSingleEdgeFields = select
    .filter((x) => x.startsWith('+'))
    .map((x) => x.substring(1));

  let sortString = calculateSortPriorities(
    targetModel.getSortPriorities(),
    sort
  ).join(' ');
  let query = targetModel
    .find({ _id: { $in: idList } })
    .sort(sortString)
    .select(
      calculateSelectedFields(
        flattenFields(targetModel, (model) => model.getSimpleFields()),
        select.filter((x) => !x.startsWith('+'))
      ).concat(selectedSingleEdgeFields)
    );

  for (let field of selectedSingleEdgeFields) {
    query.populate(
      field,
      flattenFields(singleEdgeFields.get(field)!.model, (model) =>
        model.getSimpleFields()
      )
    );
  }

  let results = await query.skip(start).limit(count).exec();

  let resultsIdMap = new Map<ObjectId, number>();
  for (let i = 0; i < results.length; i++) {
    resultsIdMap.set(results[i]._id as ObjectId, i);
    results[i].$ignore('_parent');
  }
  for (let i = 0; i < paths.length; i++) {
    for (let j = 0; j < idLists[i].length; j++) {
      let index = resultsIdMap.get(idLists[i][j]);
      if (index !== undefined) {
        results[index].set('_parent', paths[i]);
      }
    }
  }

  return results;
}
