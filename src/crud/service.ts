import { getName, DocumentType as Doc } from '@typegoose/typegoose';

import {
  ObjectId,
  ClientError,
  CrudModel,
  UpdateFunctions,
} from '../utils/utils';

export async function create<T>(model: CrudModel<T>, obj: T): Promise<Doc<T>> {
  // very strange type error occurs here without a type assertion
  // countless hours have been wasted on this one line
  // don't try to fix it
  return (await model.build(obj).save()) as Doc<T>;
}

export async function read<T>(
  model: CrudModel<T>,
  id: ObjectId
): Promise<Doc<T>> {
  let doc = await model.findById(id).exec();
  if (!doc)
    throw new ClientError(
      404,
      `document of type "${getName(model)}" with id "${id}" not found`
    );
  return doc;
}

export async function update<T>(
  model: CrudModel<T>,
  updateFunctions: UpdateFunctions<T>,
  id: ObjectId,
  operation: string,
  payload: string[] | ObjectId[]
): Promise<Doc<T>> {
  if (!updateFunctions.has(operation))
    throw new ClientError(
      400,
      `invalid operation: ${operation}; list of valid operations: ${updateFunctions.keys()}`
    );

  let doc = await model.findById(id);

  if (!doc)
    throw new ClientError(
      404,
      `document of type "${getName(model)}" with id "${id}" not found`
    );

  updateFunctions.get(operation)(doc, payload);

  return (await doc.save()) as Doc<T>;
}
