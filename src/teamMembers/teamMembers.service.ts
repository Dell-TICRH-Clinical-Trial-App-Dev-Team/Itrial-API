import { getName, DocumentType as Doc } from '@typegoose/typegoose';

import {
  doesDocumentWithIdExist,
  isArrayOfStrings,
  ClientError,
  ObjectId,
} from '../utils/utils';

import { TeamMember } from './teamMembers.model';
import { TeamMemberModel } from '../models';

export const updateFunctions = new Map([
  ['rename', rename],
  ['update address', updateAddress],
  ['update email', updateEmail],
  ['update phoneNumber', updatePhoneNumber],
  ['set ccc', setCcc],
  ['add sites', addSites],
  ['add trials', addTrials],
  ['remove sites', removeSites],
  ['remove trials', removeTrials],
]);

export async function getTeamMemberByEmail(
  email: string
): Promise<Doc<TeamMember>> {
  let doc = await TeamMemberModel.findOne({ email: email }).exec();
  if (!doc)
    throw new ClientError(
      404,
      `document of type "${getName(
        TeamMemberModel
      )}" with email "${email}" not found`
    );
  return doc;
}

function rename(teamMember: Doc<TeamMember>, name: any): void {
  if (typeof name != 'string' || name == '')
    throw new ClientError(400, 'invalid name');
  teamMember.name = name;
}

function updateAddress(teamMember: Doc<TeamMember>, address: any): void {
  if (typeof address != 'string' || address == '')
    throw new ClientError(400, 'invalid address');
  teamMember.address = address;
}

function updateEmail(teamMember: Doc<TeamMember>, email: any): void {
  if (typeof email != 'string' || email == '')
    throw new ClientError(400, 'invalid email');
  teamMember.email = email;
}

function updatePhoneNumber(
  teamMember: Doc<TeamMember>,
  phoneNumber: any
): void {
  if (typeof phoneNumber != 'number' || phoneNumber < 1000000000)
    throw new ClientError(400, 'invalid name');
  teamMember.phoneNumber = phoneNumber;
}

function setCcc(teamMember: Doc<TeamMember>, cccId: any): void {
  if (!doesDocumentWithIdExist(cccId, 'TeamMember'))
    throw new ClientError(404, `ccc with id: ${cccId} does not exist`);

  teamMember.ccc = cccId;
}

function addSites(teamMember: Doc<TeamMember>, sites: any): void {
  if (!isArrayOfStrings(sites))
    throw new ClientError(400, 'sites must be passed in as [ObjectId]');

  for (let siteId of sites) {
    if (!doesDocumentWithIdExist(siteId, 'Site'))
      throw new ClientError(404, `site with id: ${siteId} not found`);
  }

  teamMember.sites.push(...sites.map(ObjectId));
}

function removeSites(teamMember: Doc<TeamMember>, sites: any): void {
  if (!isArrayOfStrings(sites))
    throw new ClientError(400, 'sites must be passed in as [ObjectId]');

  for (let siteId of sites) {
    teamMember.sites.splice(teamMember.sites.indexOf(ObjectId(siteId)));
  }
}

function addTrials(teamMember: Doc<TeamMember>, trials: any): void {
  if (!isArrayOfStrings(trials))
    throw new ClientError(400, 'trials must be passed in as [ObjectId]');

  for (let trialId of trials) {
    if (!doesDocumentWithIdExist(ObjectId(trialId), 'Trial'))
      throw new ClientError(404, `trial with id: ${trialId} not found`);
  }

  teamMember.trials.push(...trials.map(ObjectId));
}

function removeTrials(teamMember: Doc<TeamMember>, trials: any): void {
  if (!isArrayOfStrings(trials))
    throw new ClientError(400, 'trials must be passed Modelin as [ObjectId]');

  for (let trialId of trials) {
    teamMember.trials.splice(teamMember.trials.indexOf(ObjectId(trialId)));
  }
}
