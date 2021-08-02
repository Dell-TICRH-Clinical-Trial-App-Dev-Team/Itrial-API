import { NativeError, ObjectId } from 'mongoose';
import { Trial, ITrial } from './trials.model';
import { ITrialProtocol } from './trialProtocols/trialProtocols.model';
import { doesDocumentWithIdExist, isArrayOfStrings } from '../utils/utils';

const updateFunctions = new Map([
  ['rename', rename],
  ['update endpointResults', updateEndpointResults],
  ['add protocols', addProtocols],
  ['remove protocols', removeProtocols],
  ['set protocols', setProtocols],
  ['add permissions', addPermissions],
  ['remove permissions', removePermissions],
  ['set permissions', setPermissions],
  ['update blinded', updateBlinded],
  ['add sites', addSites],
  ['add teamMembers', addTeamMembers],
  ['add groups', addGroups],
  ['add patient', addPatients],
  ['remove sites', removeSites],
  ['remove teamMembers', removeTeamMembers],
  ['remove groups', removeGroups],
  ['remove patient', removePatients],
]);
const updateOptions = [...updateFunctions.keys()];

export async function getTrialById(id: string): Promise<ITrial> {
  return new Promise((resolve, reject) => {
    Trial.findById(id, (err: NativeError, trial: ITrial) => {
      if (err) return reject({ status: 400, message: err.message });
      else if (!trial)
        return reject({
          status: 404,
          message: `Trial with id: ${id} not found`,
        });
      else resolve(trial);
    });
  });
}

export async function createTrial(newTrial: ITrial): Promise<ITrial> {
  return new Promise((resolve, reject) => {
    const trial = Trial.build(newTrial);

    trial.save((err: NativeError, newTrial: ITrial) => {
      if (err) return reject(err);
      else resolve(newTrial);
    });
  });
}

export async function updateTrial(
  id: string,
  operation: string,
  payload: any
): Promise<ITrial> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      return reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    var trial: ITrial;
    try {
      trial = await Trial.findById(id);
    } catch (e) {
      return reject({ status: 404, message: e.message });
    }

    try {
      updateFunctions.get(operation)(trial, payload);
    } catch (err) {
      return reject(err);
    }

    trial.save((err: NativeError, updatedTrial: ITrial) => {
      if (err) return reject({ status: 400, message: err.message });
      else resolve(updatedTrial);
    });
  });
}

function rename(trial: ITrial, name: any): void {
  if (typeof name != 'string' || name == '')
    throw { status: 400, message: 'Invalid name' };
  trial.name = name;
}

function updateBlinded(trial: ITrial, blinded: any): void {
  if (typeof blinded != 'boolean')
    throw { status: 400, message: 'Blinded must be a boolean' };
  trial.blinded = blinded;
}

function updateEndpointResults(trial: ITrial, endpointResults: any): void {
  if (typeof endpointResults != 'string')
    throw { status: 400, message: 'endpointResults must be a string' };
  trial.endpointResults = endpointResults;
}

function addTeamMembers(trial: ITrial, teamMembers: any): void {
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

  trial.teamMembers.push(...teamMembers);
}

function removeTeamMembers(trial: ITrial, teamMembers: any): void {
  if (!isArrayOfStrings(teamMembers))
    throw {
      status: 400,
      message: 'teamMembers must be passed in as [ObjectId]',
    };

  teamMembers.forEach((teamMemberid: ObjectId) => {
    trial.teamMembers.splice(trial.teamMembers.indexOf(teamMemberid));
  });
}

function addPermissions(trial: ITrial, permissions: any): void {
  if (!isArrayOfStrings(permissions))
    throw {
      status: 400,
      message: 'permissions must be passed in as [string]',
    };

  trial.permissions.push(...permissions);
}

function removePermissions(trial: ITrial, permissions: any): void {
  if (!isArrayOfStrings(permissions))
    throw {
      status: 400,
      message: 'permissions must be passed in as [string]',
    };

  permissions.forEach((permission: string) => {
    trial.permissions.splice(trial.permissions.indexOf(permission));
  });
}

function setPermissions(trial: ITrial, permissions: any): void {
  if (!isArrayOfStrings(permissions))
    throw {
      status: 400,
      message: 'permissions must be passed in as [string]',
    };

  trial.permissions = permissions;
}

function addProtocols(trial: ITrial, protocols: any): void {
  if (!protocols[0]?.name)
    throw {
      status: 400,
      message: 'protocols must be passed in as [ITrialProtcol]',
    };

  trial.protocols.push(...protocols);
}

function removeProtocols(trial: ITrial, protocols: any): void {
  if (!protocols[0]?.name)
    throw {
      status: 400,
      message: 'protocols must be passed in as [ITrialProtcol]',
    };

  const filteredProtocols = trial.protocols.filter((protocol1) => {
    var shouldKeep: boolean = true;
    protocols.forEach((protocol2: ITrialProtocol) => {
      if (protocol1.name == protocol2.name) shouldKeep = false;
    });
    return shouldKeep;
  }) as [ITrialProtocol];

  trial.protocols = filteredProtocols;
}

function setProtocols(trial: ITrial, protocols: any): void {
  if (!protocols[0]?.name)
    throw {
      status: 400,
      message: 'protocols must be passed in as [ITrialProtcol]',
    };

  trial.protocols = protocols;
}

function addGroups(trial: ITrial, groups: any): void {
  if (!isArrayOfStrings(groups))
    throw {
      status: 400,
      message: 'groups must be passed in as [ObjectId]',
    };

  groups.forEach((groupid: string) => {
    if (!doesDocumentWithIdExist(groupid, 'Group'))
      throw {
        status: 404,
        message: `group with id ${groupid} not found`,
      };
  });

  trial.groups.push(...groups);
}

function removeGroups(trial: ITrial, groups: any): void {
  if (!isArrayOfStrings(groups))
    throw {
      status: 400,
      message: 'groups must be passed in as [ObjectId]',
    };

  groups.forEach((groupid: ObjectId) => {
    trial.groups.splice(trial.groups.indexOf(groupid));
  });
}

function addPatients(trial: ITrial, patients: any): void {
  if (!isArrayOfStrings(patients))
    throw {
      status: 400,
      message: 'patients must be passed in as [ObjectId]',
    };

  patients.forEach((patientid: string) => {
    if (!doesDocumentWithIdExist(patientid, 'TeamMember'))
      throw {
        status: 404,
        message: `patient with id ${patientid} not found`,
      };
  });

  trial.patients.push(...patients);
}

function removePatients(trial: ITrial, patients: any): void {
  if (!isArrayOfStrings(patients))
    throw {
      status: 400,
      message: 'patients must be passed in as [ObjectId]',
    };

  patients.forEach((patientid: ObjectId) => {
    trial.patients.splice(trial.patients.indexOf(patientid));
  });
}

function addSites(trial: ITrial, sites: any): void {
  if (!isArrayOfStrings(sites))
    throw {
      status: 400,
      message: 'sites must be passed in as [ObjectId]',
    };

  sites.forEach((siteid: string) => {
    if (!doesDocumentWithIdExist(siteid, 'Site'))
      throw {
        status: 404,
        message: `sites with id ${siteid} not found`,
      };
  });

  trial.sites.push(...sites);
}

function removeSites(trial: ITrial, sites: any): void {
  if (!isArrayOfStrings(sites))
    throw {
      status: 400,
      message: 'sites must be passed in as [ObjectId]',
    };

  sites.forEach((siteid: ObjectId) => {
    trial.sites.splice(trial.sites.indexOf(siteid));
  });
}
