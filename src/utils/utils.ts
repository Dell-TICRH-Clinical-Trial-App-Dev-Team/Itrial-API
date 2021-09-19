import mongoose from 'mongoose';
import { ReturnModelType, DocumentType as Doc } from '@typegoose/typegoose';
import express, { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';

import { throwValidation } from '../utils/err';

import {
  EndpointModel,
  SiteModel,
  PatientModel,
  TeamMemberModel,
  GroupModel,
  TrialModel,
} from '../models';

// types

export interface CorrespondingEdge {
  model: ModelClass;
  target?: string;
  targetMulti?: boolean;
}

export interface ModelClass {
  getSortPriorities(): string[];
  getSimpleFields(): string[];
  getSubdocumentFieldMap(): Record<string, ModelClass>;
  getSingleEdgeFieldMap(): Record<string, CorrespondingEdge>;
  getSubcollectionFieldMap(): Record<string, ModelClass>;
  getMultiEdgeFieldMap(): Record<string, CorrespondingEdge>;
}

interface Buildable<T> {
  build(obj: T): Promise<Doc<T>>;
}

export type Model<T> = ReturnModelType<new (...args: any) => T> & ModelClass & Buildable<T>;
export import ObjectId = mongoose.Types.ObjectId;

// express

export function handler(
  handler: express.RequestHandler
): express.RequestHandler {
  return expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      throwValidation(validationResult(req));
      return await handler(req, res, next);
    }
  );
}

// logic

export function isArrayOfStrings(arr: any): arr is string[] {
  if (Array.isArray(arr))
    return (
      arr.filter(
        (item) =>
          typeof item == 'string' ||
          typeof item?.toString() == 'string'
      ).length > 0
    );

  return false;
}

// model map

let modelMap: Map<string, any> = new Map();
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
