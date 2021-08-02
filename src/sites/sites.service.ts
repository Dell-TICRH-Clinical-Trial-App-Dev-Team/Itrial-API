import { NativeError, ObjectId } from 'mongoose';
import { Site, ISite } from './sites.model';

import { doesDocumentWithIdExist, isArrayOfStrings } from '../utils/utils';

const updateFunctions = new Map([
  ['rename', rename],
  ['update address', updateAddress],
  ['add trials', addTrials],
  ['add teamMembers', addTeamMembers],
  ['add cccs', addCCCs],
  ['remove trials', removeTrials],
  ['remove teamMembers', removeTeamMembers],
  ['remove cccs', removeCCCs],
]);
const updateOptions = [...updateFunctions.keys()];

export async function getSiteById(id: string): Promise<ISite> {
  return new Promise((resolve, reject) => {
    Site.findById(id, (err: NativeError, site: ISite) => {
      if (err) return reject({ status: 400, message: err.message });
      else if (!site)
        return reject({
          status: 404,
          message: `Site with id: ${id} not found`,
        });
      else resolve(site);
    });
  });
}

export async function createSite(newSite: ISite): Promise<ISite> {
  return new Promise((resolve, reject) => {
    const site = Site.build(newSite);

    site.save((err: NativeError, newSite: ISite) => {
      if (err) return reject(err);
      else resolve(newSite);
    });
  });
}

export async function updateSite(
  id: string,
  operation: string,
  payload: string | [ObjectId]
): Promise<ISite> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      return reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    var site: ISite;
    try {
      site = await Site.findById(id);
    } catch (e) {
      return reject({ status: 404, message: e.message });
    }

    if (site == null)
      return reject({
        status: 404,
        message: `site with id: ${id} not found`,
      });

    try {
      updateFunctions.get(operation)(site, payload);
    } catch (err) {
      return reject(err);
    }

    site.save((err: NativeError, updatedSite: ISite) => {
      if (err) return reject({ status: 400, message: err.message });
      else resolve(updatedSite);
    });
  });
}

function rename(site: ISite, name: any): void {
  if (typeof name != 'string' || name == '')
    throw { status: 400, message: 'Invalid name' };
  site.name = name;
}

function updateAddress(site: ISite, address: any): void {
  if (typeof address != 'string' || address == '')
    throw { status: 400, message: 'Invalid address' };
  site.address = address;
}

function addTeamMembers(site: ISite, teamMembers: any): void {
  if (!isArrayOfStrings(teamMembers))
    throw {
      status: 400,
      message: 'teamMembers must be passed in as [ObjectId]',
    };

  teamMembers.forEach((teamMemberid: string) => {
    if (!doesDocumentWithIdExist(teamMemberid, 'TeamMember'))
      throw {
        status: 404,
        message: `teamMember with id ${teamMemberid} not found`,
      };
  });

  site.teamMembers.push(...teamMembers);
}

function removeTeamMembers(site: ISite, teamMembers: any): void {
  if (!isArrayOfStrings(teamMembers))
    throw {
      status: 400,
      message: 'teamMembers must be passed in as [ObjectId]',
    };

  teamMembers.forEach((teamMemberid: ObjectId) => {
    site.teamMembers.splice(site.teamMembers.indexOf(teamMemberid));
  });
}

function addTrials(site: ISite, trials: any): void {
  if (!isArrayOfStrings(trials))
    throw {
      status: 400,
      message: 'trials must be passed in as [ObjectId]',
    };

  trials.forEach((trialid: string) => {
    if (!doesDocumentWithIdExist(trialid, 'Trial'))
      throw {
        status: 404,
        message: `trial with id ${trialid} not found`,
      };
  });

  site.trials.push(...trials);
}

function removeTrials(site: ISite, trials: any): void {
  if (!isArrayOfStrings(trials))
    throw {
      status: 400,
      message: 'trials must be passed in as [ObjectId]',
    };

  trials.forEach((trialid: ObjectId) => {
    site.trials.splice(site.trials.indexOf(trialid));
  });
}

function addCCCs(site: ISite, cccs: any): void {
  if (!isArrayOfStrings(cccs))
    throw {
      status: 400,
      message: 'cccs must be passed in as [ObjectId]',
    };

  cccs.forEach((cccid: string) => {
    if (!doesDocumentWithIdExist(cccid, 'CCC'))
      throw {
        status: 404,
        message: `ccc with id ${cccid} not found`,
      };
  });

  site.cccs.push(...cccs);
}

function removeCCCs(site: ISite, cccs: any): void {
  if (!isArrayOfStrings(cccs))
    throw {
      status: 400,
      message: 'cccs must be passed in as [ObjectId]',
    };

  cccs.forEach((cccid: ObjectId) => {
    site.cccs.splice(site.cccs.indexOf(cccid));
  });
}
