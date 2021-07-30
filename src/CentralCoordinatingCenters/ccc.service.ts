import { NativeError, ObjectId } from 'mongoose';
import {
  CentralCoordinatingCenter,
  ICentralCoordinatingCenter,
} from './ccc.model';

const updateOptions = [
  'rename',
  'add trials',
  'add sites',
  'add teamMembers',
  'remove trials',
  'remove sites',
  'remove teamMembers',
];
export type UpdateOption = typeof updateOptions[number];

export async function getCCCById(
  id: string
): Promise<ICentralCoordinatingCenter> {
  return new Promise((resolve, reject) => {
    CentralCoordinatingCenter.findById(
      id,
      (err: NativeError, ccc: ICentralCoordinatingCenter) => {
        if (err) reject({ status: 400, message: err.message });
        else if (!ccc)
          reject({
            status: 404,
            message: `Central Coordinating Center with id: ${id} not found`,
          });
        else resolve(ccc);
      }
    );
  });
}

export async function createCCC(
  newCCC: ICentralCoordinatingCenter
): Promise<ICentralCoordinatingCenter> {
  return new Promise((resolve, reject) => {
    const ccc = CentralCoordinatingCenter.build(newCCC);

    ccc.save((err: NativeError, ccc: ICentralCoordinatingCenter) => {
      if (err) reject(err);
      else resolve(ccc);
    });
  });
}

export async function updateCCC(
  id: string,
  operation: UpdateOption,
  payload: string | [ObjectId]
): Promise<ICentralCoordinatingCenter> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    var ccc: ICentralCoordinatingCenter;
    try {
      ccc = await CentralCoordinatingCenter.findById(id);
    } catch (e) {
      reject({ status: 404, message: e.message });
    }

    if (typeof payload == 'string') ccc.name = payload;
    else {
      switch (operation) {
        case 'add trials':
          ccc.trials.push(...payload);
          break;
        case 'add sites':
          ccc.sites.push(...payload);
          break;
        case 'add teamMembers':
          ccc.teamMembers.push(...payload);
          break;
        case 'remove trials':
          payload.forEach((trialId) => {
            ccc.trials.splice(ccc.trials.indexOf(trialId));
          });
          break;
        case 'remove sites':
          payload.forEach((siteId) => {
            ccc.sites.splice(ccc.sites.indexOf(siteId));
          });
          break;
        case 'remove teamMembers':
          payload.forEach((teamMemberId) => {
            ccc.teamMembers.splice(ccc.teamMembers.indexOf(teamMemberId));
          });
          break;
      }
    }

    ccc.save((err: NativeError, updatedCCC: ICentralCoordinatingCenter) => {
      if (err) reject({ status: 400, message: err.message });
      else resolve(updatedCCC);
    });
  });
}
