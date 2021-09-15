import { Result } from 'express-validator';
import { getName } from '@typegoose/typegoose';
import mongoose from 'mongoose';

import { ObjectId, Model } from '../utils/utils';

export class ClientError {
  status: number;
  errors: string[];

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
      errors.push(
        `invalid value for parameter "${error.param}": "${error.msg}"`
      );
    }
    throw errors;
  }
}

export function documentNotFound(model: Model<any>, id: ObjectId): ClientError {
  return new ClientError(
    404,
    `document of type "${getName(model)}" with id "${id}" not found`
  );
}

export function checkUpdateResult(
  model: Model<unknown>,
  id: ObjectId,
  result: mongoose.UpdateWriteOpResult
) {
  if (result.n < 1) throw documentNotFound(model, id);
}
