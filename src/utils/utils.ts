import mongoose from 'mongoose';
import { Result } from 'express-validator';
import { ReturnModelType as Model, DocumentType as Doc } from '@typegoose/typegoose';

import { EndpointModel, CccModel, SiteModel, PatientModel, TeamMemberModel, GroupModel, TrialModel } from '../models';


export import ObjectId = mongoose.Types.ObjectId;

interface Buildable<T> {
  build(obj: T): Doc<T>;
}

export type CrudModel<T> = Model<new (...args: any) => T> & Buildable<T>;
export type UpdateFunctions<T> = Map<string, ((doc: Doc<T>, param: any) => void)>;

export class ClientError {
  status: number;
  errors: string[]
  
  constructor(status: number, message?: string) {
    this.status = status;
    this.errors = message ? [message] : [];
  }

  public push(message: string) {
    this.errors.push(message);
  }
}


export function throwValidation(result: Result) {
  if (!result.isEmpty()) {
    let errors = new ClientError(400);
    for (let error of result.array()) {
      errors.push(`invalid value for parameter "${error.param}": "${error.msg}"`);
    }
    throw errors;
  }
}


export function isArrayOfStrings(arr: any): arr is string[] {
  if (Array.isArray(arr))
    return (
      arr.filter(
        (item) => typeof item == 'string' || typeof item?.toString() == 'string'
      ).length > 0
    );

  return false;
}


let modelMap: Map<string, any> = new Map();
modelMap.set('Ccc', CccModel);
modelMap.set('Endpoint', EndpointModel);
modelMap.set('Patient', PatientModel);
modelMap.set('Site', SiteModel);
modelMap.set('TeamMember', TeamMemberModel);
modelMap.set('Trial', TrialModel);
modelMap.set('Group', GroupModel);

export async function doesDocumentWithIdExist(
  id: ObjectId | string,
  modelName: string
): Promise<boolean> {
  
  const count = await modelMap.get(modelName).countDocuments({ _id: id });
  return count != 0;
}
