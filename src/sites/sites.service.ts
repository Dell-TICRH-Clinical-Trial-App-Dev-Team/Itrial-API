import { DocumentType as Doc } from '@typegoose/typegoose';

import {
  doesDocumentWithIdExist,
  isArrayOfStrings,
  ClientError,
  ObjectId,
} from '../utils/utils';

import { Site } from './sites.model';

export const updateFunctions = new Map([
  ['rename', rename],
  ['update address', updateAddress],
  ['add trials', addTrials],
  ['add teamMembers', addTeamMembers],
  ['add cccs', addCccs],
  ['remove trials', removeTrials],
  ['remove teamMembers', removeTeamMembers],
  ['remove cccs', removeCccs],
]);

function rename(site: Doc<Site>, name: any): void {
  if (typeof name != 'string' || name == '')
    throw new ClientError(400, 'invalid name');
  site.name = name;
}

function updateAddress(site: Doc<Site>, address: any): void {
  if (typeof address != 'string' || address == '')
    throw new ClientError(400, 'invalid address');
  site.address = address;
}

function addTeamMembers(site: Doc<Site>, teamMembers: any): void {
  if (!isArrayOfStrings(teamMembers))
    throw new ClientError(400, 'teamMembers must be passed in as [ObjectId]');

  for (let teamMemberId of teamMembers) {
    if (!doesDocumentWithIdExist(teamMemberId, 'TeamMember'))
      throw new ClientError(
        404,
        `teamMember with id ${teamMemberId} not found`
      );
  }

  site.teamMembers.push(...teamMembers.map(ObjectId));
}

function removeTeamMembers(site: Doc<Site>, teamMembers: any): void {
  if (!isArrayOfStrings(teamMembers))
    throw new ClientError(400, 'teamMembers must be passed in as [ObjectId]');

  for (let teamMemberId of teamMembers) {
    site.teamMembers.splice(site.teamMembers.indexOf(ObjectId(teamMemberId)));
  }
}

function addTrials(site: Doc<Site>, trials: any): void {
  if (!isArrayOfStrings(trials))
    throw new ClientError(400, 'trials must be passed in as [ObjectId]');

  for (let trialId of trials) {
    if (!doesDocumentWithIdExist(trialId, 'Trial'))
      throw new ClientError(404, `trial with id ${trialId} not found`);
  }

  site.trials.push(...trials.map(ObjectId));
}

function removeTrials(site: Doc<Site>, trials: any): void {
  if (!isArrayOfStrings(trials))
    throw new ClientError(400, 'trials must be passed in as [ObjectId]');

  for (let trialId of trials) {
    site.trials.splice(site.trials.indexOf(ObjectId(trialId)));
  }
}

function addCccs(site: Doc<Site>, cccs: any): void {
  if (!isArrayOfStrings(cccs))
    throw new ClientError(400, 'cccs must be passed in as [ObjectId]');

  for (let cccId of cccs) {
    if (!doesDocumentWithIdExist(cccId, 'TeamMember'))
      throw new ClientError(404, `team member with id ${cccId} not found`);
  }

  site.cccs.push(...cccs.map(ObjectId));
}

function removeCccs(site: Doc<Site>, cccs: any): void {
  if (!isArrayOfStrings(cccs))
    throw new ClientError(400, 'cccs must be passed in as [ObjectId]');

  for (let cccId of cccs) {
    site.cccs.splice(site.cccs.indexOf(ObjectId(cccId)));
  }
}
