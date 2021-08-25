import { Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';

import { ObjectId, throwValidation, CrudModel, UpdateFunctions } from '../utils/utils';
import * as service from './service';

export function create<T>(model: CrudModel<T>) {
  return asyncHandler(async (req: Request, res: Response) => {
    return res.status(201).json(await service.create(model, req.body));
  });
}

export function read<T>(model: CrudModel<T>) {
  return [
    param('id').custom(ObjectId.isValid),
    asyncHandler(async (req: Request, res: Response) => {
      throwValidation(validationResult(req));
      
      return res.status(200).json(await service.read(
        model, ObjectId(req.params.id)));
    })
  ];
}

export function update<T>(model: CrudModel<T>, 
  updateFunctions: UpdateFunctions<T>) { 

  return [
    param('id').custom(ObjectId.isValid),
    asyncHandler(async (req: Request, res: Response) => {
      throwValidation(validationResult(req));
    
      return res.status(204).json(await service.update(
        model, updateFunctions,
        ObjectId(req.params.id), 
        req.body.operation, 
        req.body.payload));
    })
  ];
}
