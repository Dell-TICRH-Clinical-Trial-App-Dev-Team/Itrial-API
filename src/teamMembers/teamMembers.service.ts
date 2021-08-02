import { NativeError, ObjectId } from 'mongoose';
import { doesDocumentWithIdExist, isArrayOfStrings } from '../utils/utils';
import { TeamMember, ITeamMember } from './teamMembers.model';

const updateFunctions = new Map([
  ['rename', rename],
  ['update address', updateAddress],
  ['update email', updateEmail],
  ['update phoneNumber', updatePhoneNumber],
  ['add permissions', addPermissions],
  ['remove permissions', removePermissions],
  ['set permissions', setPermissions],
  ['add cccs', addCCCs],
  ['add sites', addSites],
  ['add trials', addTrials],
  ['remove cccs', removeCCCs],
  ['remove sites', removeSites],
  ['remove trials', removeTrials],
]);
const updateOptions = [...updateFunctions.keys()];

export async function getTeamMemberById(id: string): Promise<ITeamMember> {
  return new Promise((resolve, reject) => {
    TeamMember.findById(id, (err: NativeError, teamMember: ITeamMember) => {
      if (err) return reject({ status: 400, message: err.message });
      else if (!teamMember)
        return reject({
          status: 404,
          message: `Team Member with id: ${id} not found`,
        });
      else resolve(teamMember);
    });
  });
}

export async function createTeamMember(
  newTeamMember: ITeamMember
): Promise<ITeamMember> {
  return new Promise((resolve, reject) => {
    const teamMember = TeamMember.build(newTeamMember);

    teamMember.save((err: NativeError, newTeamMember: ITeamMember) => {
      if (err) return reject(err);
      else resolve(newTeamMember);
    });
  });
}

export async function updateTeamMember(
  id: string,
  operation: string,
  payload: any
): Promise<ITeamMember> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      return reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    var teamMember: ITeamMember;
    try {
      teamMember = await TeamMember.findById(id);
    } catch (e) {
      return reject({ status: 404, message: e.message });
    }

    try {
      updateFunctions.get(operation)(teamMember, payload);
    } catch (err) {
      return reject(err);
    }

    if (teamMember == null)
      return reject({
        status: 404,
        message: `teamMember with id: ${id} not found`,
      });

    teamMember.save((err: NativeError, updatedTeamMember: ITeamMember) => {
      if (err) return reject({ status: 400, message: err.message });
      else resolve(updatedTeamMember);
    });
  });
}

function rename(teamMember: ITeamMember, name: any): void {
  if (typeof name != 'string' || name == '')
    throw { status: 400, message: 'Invalid name' };
  teamMember.name = name;
}

function updateAddress(teamMember: ITeamMember, address: any): void {
  if (typeof address != 'string' || address == '')
    throw { status: 400, message: 'Invalid address' };
  teamMember.address = address;
}

function updateEmail(teamMember: ITeamMember, email: any): void {
  if (typeof email != 'string' || email == '')
    throw { status: 400, message: 'Invalid email' };
  teamMember.email = email;
}

function updatePhoneNumber(teamMember: ITeamMember, phoneNumber: any): void {
  if (typeof phoneNumber != 'number' || phoneNumber < 1000000000)
    throw { status: 400, message: 'Invalid name' };
  teamMember.phoneNumber = phoneNumber;
}

function addPermissions(teamMember: ITeamMember, permissions: any): void {
  if (!isArrayOfStrings(permissions))
    throw { status: 400, message: 'permissions must be passed in as [string]' };

  teamMember.permissions.push(...permissions);
}

function removePermissions(teamMember: ITeamMember, permissions: any): void {
  if (!isArrayOfStrings(permissions))
    throw { status: 400, message: 'permissions must be passed in as [string]' };

  permissions.forEach((permission: string) => {
    teamMember.permissions.splice(teamMember.permissions.indexOf(permission));
  });
}

function setPermissions(teamMember: ITeamMember, permissions: any): void {
  if (!isArrayOfStrings(permissions))
    throw { status: 400, message: 'permissions must be passed in as [string]' };

  teamMember.permissions = permissions;
}

function addCCCs(teamMember: ITeamMember, cccs: any): void {
  if (!isArrayOfStrings(cccs))
    throw {
      status: 400,
      message: 'cccs must be passed in as [ObjectId]',
    };

  cccs.forEach((cccid: ObjectId) => {
    if (!doesDocumentWithIdExist(cccid, 'CCC'))
      throw {
        status: 404,
        message: `ccc with id: ${cccid} does not exist`,
      };
  });

  teamMember.cccs.push(...cccs);
}

function removeCCCs(teamMember: ITeamMember, cccs: any): void {
  if (!isArrayOfStrings(cccs))
    throw {
      status: 400,
      message: 'cccs must be passed in as [ObjectId]',
    };

  cccs.forEach((cccid: ObjectId) => {
    teamMember.cccs.splice(teamMember.cccs.indexOf(cccid));
  });
}

function addSites(teamMember: ITeamMember, sites: any): void {
  if (!isArrayOfStrings(sites))
    throw {
      status: 400,
      message: 'sites must be passed in as [ObjectId]',
    };

  sites.forEach((siteid: ObjectId) => {
    if (!doesDocumentWithIdExist(siteid, 'Site'))
      throw { status: 404, message: `site with id: ${siteid} not found` };
  });

  teamMember.sites.push(...sites);
}

function removeSites(teamMember: ITeamMember, sites: any): void {
  if (!isArrayOfStrings(sites))
    throw {
      status: 400,
      message: 'sites must be passed in as [ObjectId]',
    };

  sites.forEach((siteid: ObjectId) => {
    teamMember.sites.splice(teamMember.sites.indexOf(siteid));
  });
}

function addTrials(teamMember: ITeamMember, trials: any): void {
  if (!isArrayOfStrings(trials))
    throw {
      status: 400,
      message: 'trials must be passed in as [ObjectId]',
    };

  trials.forEach((trialid: ObjectId) => {
    if (!doesDocumentWithIdExist(trials, 'Trial'))
      throw { status: 404, message: `trial with id: ${trialid} not found` };
  });

  teamMember.sites.push(...trials);
}

function removeTrials(teamMember: ITeamMember, trials: any): void {
  if (!isArrayOfStrings(trials))
    throw {
      status: 400,
      message: 'trials must be passed in as [ObjectId]',
    };

  trials.forEach((trialid: ObjectId) => {
    teamMember.trials.splice(teamMember.trials.indexOf(trialid));
  });
}
