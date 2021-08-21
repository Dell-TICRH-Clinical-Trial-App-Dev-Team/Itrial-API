import { NativeError, ObjectId } from 'mongoose';
import {Ccc, ICcc} from './cccs.model';

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

export async function getCccById(
  id: string
): Promise<ICcc> {
  return new Promise((resolve, reject) => {
    Ccc.findById(
      id,
      (err: NativeError, ccc: ICcc) => {
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

export async function createCcc(
  newCcc: ICcc
): Promise<ICcc> {
  return new Promise((resolve, reject) => {
    const ccc = Ccc.build(newCcc);

    ccc.save((err: NativeError, ccc: ICcc) => {
      if (err) return reject(err);
      else resolve(ccc);
    });
  });
}

export async function updateCcc(
  id: string,
  operation: string,
  payload: string | [ObjectId]
): Promise<ICcc> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      return reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    let ccc: ICcc =
      await Ccc.findById(id);

    if (ccc == null)
      return reject({ status: 404, message: `ccc with id: ${id} not found` });

    try {
      updateFunctions.get(operation)(ccc, payload);
    } catch (err) {
      return reject(err);
    }

    ccc.save((err: NativeError, updatedCcc: ICcc) => {
      if (err) return reject({ status: 400, message: err.message });
      else resolve(updatedCcc);
    });
  });
}

function rename(ccc: ICcc, name: any): void {
  if (typeof name != 'string' || name == '')
    throw { status: 400, message: 'Invalid name' };
  ccc.name = name;
}

function addTrials(ccc: ICcc, trialsids: any): void {
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

function addSites(ccc: ICcc, sitesids: any): void {
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
  ccc: ICcc,
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

function removeTrials(ccc: ICcc, trialsids: any): void {
  if (!isArrayOfStrings(trialsids))
    throw {
      status: 400,
      message: 'trial id(s) must be passed in as [ObjectId]',
    };
  trialsids.forEach((trialId: ObjectId) => {
    ccc.trials.splice(ccc.trials.indexOf(trialId));
  });
}

function removeSites(ccc: ICcc, sitesids: any): void {
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
  ccc: ICcc,
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
