import { DocumentType as Doc, getName } from '@typegoose/typegoose';
import mongoose, { Query } from 'mongoose';

import { ObjectId, Model, traverse } from '../utils/utils';
import { checkUpdateResult, documentNotFound, ClientError } from '../utils/err';

/* eslint { @typescript-eslint/explicit-function-return-type: "error" } */

function stripField(field: string): string {
  return field.startsWith('+') || field.startsWith('-')
    ? field.substring(1)
    : field;
}

function calculateSortString(base: string, override: string): string {
  let overrideList = override.split(/s+/);
  let overrideNames = new Set(overrideList.map(stripField));
  let baseList = base
    .split(/\s+/)
    .filter((field) => !overrideNames.has(stripField(field)));
  return overrideList.concat(baseList).join(' ');
}

function calculateSelectString(base: string, override: string): string {
  let overrideList = override.split(/s+/);
  if (!overrideList.length || !overrideList[0].startsWith('-'))
    return override;
  let baseList = base.split(/\s+/);
  for (let field of overrideList) {
    let index = baseList.indexOf(stripField(field));
    if (index >= 0) baseList.splice(index, 1);
  }
  return baseList.join(' ');
}

// document operations

export async function processGet(
  model: Model<unknown>,
  query: Query<Doc<unknown> | null, Doc<unknown>>,
  select: string
): Promise<Doc<unknown> | null> {
  select = calculateSelectString(
    model.getSelectString() +
      ' ' +
      Object.keys(model.getSinglePopulateStrings()).join(' '),
    select
  );

  query = query.select(select);
  let selectSet = new Set(select.split(' '));

  for (let [field, selectString] of Object.entries(
    model.getSinglePopulateStrings()
  )) {
    if (selectSet.has(field)) query = query.populate(field, selectString);
  }

  return await query.exec();
}

export async function getDocByEmail(
  model: Model<unknown>,
  email: string,
  select: string
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
  select: string
): Promise<Doc<unknown>> {
  let doc = await processGet(model, model.findById(id), select);
  if (!doc) throw documentNotFound(model, id);
  return doc;
}

export async function setDoc(
  model: Model<unknown>,
  id: ObjectId,
  obj: any
): Promise<void> {
  // TODO: partial updates
  let result = await model.updateOne({ _id: id }, { $set: obj }).exec();
  if (result.n < 1) throw documentNotFound(model, id);
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

// one to _
export async function getEdge(
  sourceModel: Model<unknown>,
  sourcePath: string,
  targetModel: Model<unknown>,
  sourceId: ObjectId
): Promise<Doc<unknown> | null> {
  let doc = await sourceModel.findById(sourceId).select(sourcePath).exec();
  if (!doc) throw documentNotFound(sourceModel, sourceId);
  return await targetModel.findById(traverse(sourcePath, doc));
  // TODO: garbage collection
}

// many to _
export async function getEdges(
  sourceModel: Model<unknown>,
  sourcePath: string,
  targetModel: Model<unknown>,
  sourceId: ObjectId,
  sort: string,
  start: number,
  count: number,
  select: string
): Promise<Doc<unknown>[]> {
  let doc = await sourceModel.findById(sourceId).select(sourcePath).exec();
  if (!doc) throw documentNotFound(sourceModel, sourceId);
  let idList = traverse(sourcePath, doc);
  return await targetModel
    .find({ _id: { $in: idList } })
    .sort(calculateSortString(targetModel.getSortString(), sort))
    .skip(start)
    .limit(count)
    .select(select);
  // TODO: garbage collection
}

function computeSaveQuery(
  remove: boolean,
  toMany: boolean,
  path: string,
  id: ObjectId
): any {
  if (remove && !toMany) {
    return { $set: { [path]: null } };
  } else {
    return {
      [remove ? '$pull' : toMany ? '$addToSet' : '$set']: {
        [path]: id,
      },
    };
  }
}

// _ to _
// TODO: fix checking for IDs in single and remove modes
export async function addOrRemoveEdge(
  remove: boolean,
  sourceModel: Model<unknown>,
  sourcePath: string,
  sourceToMany: boolean,
  targetModel: Model<unknown> | undefined,
  targetPath: string | undefined,
  targetToMany: boolean | undefined,
  sourceId: ObjectId,
  targetId: ObjectId
): Promise<void> {
  const session = await mongoose.startSession();
  await session.withTransaction(async (session) => {
    if (targetModel && targetPath && targetToMany !== undefined) {
      // prettier-ignore
      let array: [Model<unknown>, string, boolean, boolean, ObjectId, ObjectId][] = [
        [sourceModel, sourcePath, sourceToMany, targetToMany, sourceId, targetId],
        [targetModel, targetPath, targetToMany, sourceToMany, targetId, sourceId]
      ];

      for (let [model, path, toMany, fromMany, id, removeId] of array) {
        if (!remove && !fromMany) {
          checkUpdateResult(
            model,
            id,
            await model
              .updateOne(
                { _id: id },
                computeSaveQuery(true, toMany, path, removeId)
              )
              .session(session)
              .exec()
          );
        }
      }

      checkUpdateResult(
        targetModel,
        targetId,
        await targetModel
          .updateOne(
            { _id: sourceId },
            computeSaveQuery(
              remove,
              targetToMany,
              targetPath,
              sourceId
            )
          )
          .session(session)
          .exec()
      );
    }

    checkUpdateResult(
      sourceModel,
      sourceId,
      await sourceModel
        .updateOne(
          { _id: sourceId },
          computeSaveQuery(remove, sourceToMany, sourcePath, targetId)
        )
        .session(session)
        .exec()
    );
  });
  session.endSession();
}
