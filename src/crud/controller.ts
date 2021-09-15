import { Request, Response } from 'express';
import { param, body } from 'express-validator';

import { ObjectId, Model, handler } from '../utils/utils';
import * as service from './service';

function respondJson(status: number, data: (req: Request) => Promise<unknown>) {
  return handler(async (req: Request, res: Response) => {
    return res.status(status).json(await data(req));
  });
}

function respondStatus(status: number, data: (req: Request) => Promise<void>) {
  return handler(async (req: Request, res: Response) => {
    await data(req);
    return res.status(status);
  });
}

// document operations

export function getDocByEmail(model: Model<any>) {
  return [
    param('email').isEmail(),
    // TODO: validate select
    respondJson(
      200,
      async (req: Request) =>
        await service.getDocByEmail(
          model,
          req.params.email,
          req.query.select as string
        )
    ),
  ];
}

export function getDoc(model: Model<any>) {
  return [
    param('id').custom(ObjectId.isValid),
    // TODO: validate select
    respondJson(
      200,
      async (req: Request) =>
        await service.getDoc(
          model,
          ObjectId(req.params.id),
          req.query.select as string
        )
    ),
  ];
}

export function setDoc(model: Model<any>) {
  return [
    param('id').custom(ObjectId.isValid),
    // TODO: validate body
    respondStatus(
      200,
      async (req: Request) =>
        await service.setDoc(model, ObjectId(req.params.id), req.body)
    ),
  ];
}

export function createDoc(model: Model<unknown>) {
  return [
    // TODO: validate body
    handler(async (req: Request, res: Response) => {
      return res
        .status(201)
        .location(
          (await service.createDoc(model, req.body))._id.toString()
        );
    }),
  ];
}

export function removeDoc(model: Model<any>) {
  return [
    param('id').custom(ObjectId.isValid),
    respondStatus(
      200,
      async (req: Request) =>
        await service.removeDoc(model, ObjectId(req.params.id))
    ),
  ];
}

// graph operations

export function getEdge(
  sourceModel: Model<any>,
  sourcePath: string,
  targetModel: Model<any>
) {
  return [
    param('id').custom(ObjectId.isValid),
    respondJson(
      200,
      async (req: Request) =>
        await service.getEdge(
          sourceModel,
          sourcePath,
          targetModel,
          ObjectId(req.params.id)
        )
    ),
  ];
}

export function getEdges(
  sourceModel: Model<any>,
  sourcePath: string,
  targetModel: Model<any>
) {
  return [
    param('id').custom(ObjectId.isValid),
    // TODO: validate query params (sort, start, count, select)
    respondJson(
      200,
      async (req: Request) =>
        await service.getEdges(
          sourceModel,
          sourcePath,
          targetModel,
          ObjectId(req.params.id),
          req.query.sort as string,
          parseInt(req.query.start as string),
          parseInt(req.query.count as string),
          req.query.select as string
        )
    ),
  ];
}

export function addOrRemoveEdge(
  remove: boolean,
  sourceModel: Model<any>,
  sourcePath: string,
  sourceToMany: boolean,
  targetModel?: Model<any>,
  targetPath?: string,
  targetToMany?: boolean
) {
  return [
    param('id').custom(ObjectId.isValid),
    body().custom(ObjectId.isValid),
    respondStatus(
      200,
      async (req: Request) =>
        await service.addOrRemoveEdge(
          remove,
          sourceModel,
          sourcePath,
          sourceToMany,
          targetModel,
          targetPath,
          targetToMany,
          ObjectId(req.params.id),
          ObjectId(req.body)
        )
    ),
  ];
}
