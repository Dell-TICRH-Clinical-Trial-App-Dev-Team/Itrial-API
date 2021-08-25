import { Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';

import { throwValidation } from '../utils/utils';
import { getPatientByEmail } from './patients.service';

export const readByEmail = [
  param('email').isEmail(),
  asyncHandler(async (req: Request, res: Response) => {
    throwValidation(validationResult(req));

    return res.status(200).json(await getPatientByEmail(req.params.email));
  }),
];
