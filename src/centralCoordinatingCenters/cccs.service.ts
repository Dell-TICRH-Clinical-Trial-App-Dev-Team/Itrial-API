import { NativeError, ObjectId } from 'mongoose';
import {
  CentralCoordinatingCenter,
  ICentralCoordinatingCenter,
} from './cccs.model';

import { doesDocumentWithIdExist, isArrayOfStrings } from '../utils/utils';

const updateFunctions = new Map([
  ['rename', rename],
  ['add trials', addTrials],
  ['add sites', addSites],
  ['add teamMembers', addTeamMembers],
  ['remove trials', removeTrials],
  ['remove sites', removeSites],
  ['remove teamMembers', removeTeamMembers],
]);
const updateOptions = [...updateFunctions.keys()];

export async function getCCCById(
  id: string
): Promise<ICentralCoordinatingCenter> {
  return new Promise((resolve, reject) => {
    CentralCoordinatingCenter.findById(
      id,
      (err: NativeError, ccc: ICentralCoordinatingCenter) => {
        if (err) return reject({ status: 400, message: err.message });
        else if (!ccc)
          return reject({
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
      if (err) return reject(err);
      else resolve(ccc);
    });
  });
}

export async function updateCCC(
  id: string,
  operation: string,
  payload: string | [ObjectId]
): Promise<ICentralCoordinatingCenter> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      return reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    var ccc: ICentralCoordinatingCenter;
    try {
      ccc = await CentralCoordinatingCenter.findById(id);
    } catch (e) {
      return reject({ status: 404, message: e.message });
    }

    if (ccc == null)
      return reject({ status: 404, message: `ccc with id: ${id} not found` });

    try {
      updateFunctions.get(operation)(ccc, payload);
    } catch (err) {
      return reject(err);
    }

    ccc.save((err: NativeError, updatedCCC: ICentralCoordinatingCenter) => {
      if (err) return reject({ status: 400, message: err.message });
      else resolve(updatedCCC);
    });
  });
}

function rename(ccc: ICentralCoordinatingCenter, name: any): void {
  if (typeof name != 'string' || name == '')
    throw { status: 400, message: 'Invalid name' };
  ccc.name = name;
}

function addTrials(ccc: ICentralCoordinatingCenter, trialsids: any): void {
  if (!isArrayOfStrings(trialsids))
    throw {
      status: 400,
      message: 'trial id(s) must be passed in as [ObjectId]',
    };

  trialsids.forEach((trialid: string) => {
    if (!doesDocumentWithIdExist(trialid, 'Trial'))
      throw { status: 404, message: `trial with id ${trialid} not found` };
  });

  ccc.trials.push(...trialsids);
}

function addSites(ccc: ICentralCoordinatingCenter, sitesids: any): void {
  if (!isArrayOfStrings(sitesids))
    throw {
      status: 400,
      message: 'site id(s) must be passed in as [ObjectId]',
    };

  sitesids.forEach((siteid: string) => {
    if (!doesDocumentWithIdExist(siteid, 'Site'))
      throw { status: 404, message: `site with id ${siteid} not found` };
  });

  ccc.sites.push(...sitesids);
}

function addTeamMembers(
  ccc: ICentralCoordinatingCenter,
  teammembersids: any
): void {
  if (!isArrayOfStrings(teammembersids))
    throw {
      status: 400,
      message: 'team member id(s) must be passed in as [ObjectId]',
    };

  teammembersids.forEach((teammemberid: string) => {
    if (!doesDocumentWithIdExist(teammemberid, 'TeamMember'))
      throw {
        status: 404,
        message: `teamMember with id ${teammemberid} not found`,
      };
  });

  ccc.teamMembers.push(...teammembersids);
}

function removeTrials(ccc: ICentralCoordinatingCenter, trialsids: any): void {
  if (!isArrayOfStrings(trialsids))
    throw {
      status: 400,
      message: 'trial id(s) must be passed in as [ObjectId]',
    };
  trialsids.forEach((trialId: ObjectId) => {
    ccc.trials.splice(ccc.trials.indexOf(trialId));
  });
}

function removeSites(ccc: ICentralCoordinatingCenter, sitesids: any): void {
  if (!isArrayOfStrings(sitesids))
    throw {
      status: 400,
      message: 'site id(s) must be passed in as [ObjectId]',
    };
  sitesids.forEach((siteId: ObjectId) => {
    ccc.sites.splice(ccc.sites.indexOf(siteId));
  });
}

function removeTeamMembers(
  ccc: ICentralCoordinatingCenter,
  teammembersids: any
): void {
  if (!isArrayOfStrings(teammembersids))
    throw {
      status: 400,
      message: 'team member id(s) must be passed in as [ObjectId]',
    };
  teammembersids.forEach((teammemberid: ObjectId) => {
    ccc.teamMembers.splice(ccc.teamMembers.indexOf(teammemberid));
  });
}
