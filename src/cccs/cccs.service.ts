import { DocumentType as Doc } from '@typegoose/typegoose';

import {
  doesDocumentWithIdExist,
  isArrayOfStrings,
  ClientError,
  ObjectId,
} from '../utils/utils';

import { Ccc } from './cccs.model';

export const updateFunctions = new Map([
  ['rename', rename],
  ['add trials', addTrials],
  ['add sites', addSites],
  ['add teamMembers', addTeamMembers],
  ['remove trials', removeTrials],
  ['remove sites', removeSites],
  ['remove teamMembers', removeTeamMembers],
]);

function rename(ccc: Doc<Ccc>, name: any): void {
  if (typeof name != 'string' || name == '')
    throw new ClientError(400, 'invalid name');
  ccc.name = name;
}

function addTrials(ccc: Doc<Ccc>, trialIds: any): void {
  if (!isArrayOfStrings(trialIds))
    throw new ClientError(400, 'trial ids must be passed in as ObjectId[]');

  for (let trialId of trialIds) {
    if (!doesDocumentWithIdExist(trialId, 'Trial'))
      throw new ClientError(404, `trial with id "${trialId}" not found`);
  }

  ccc.trials.push(...trialIds.map(ObjectId));
}

function addSites(ccc: Doc<Ccc>, siteIds: any): void {
  if (!isArrayOfStrings(siteIds))
    throw new ClientError(400, 'site ids must be passed in as ObjectId[]');

  for (let siteId of siteIds) {
    if (!doesDocumentWithIdExist(siteId, 'Site'))
      throw new ClientError(404, `site with id ${siteId} not found`);
  }

  ccc.sites.push(...siteIds.map(ObjectId));
}

function addTeamMembers(ccc: Doc<Ccc>, teamMemberIds: any): void {
  if (!isArrayOfStrings(teamMemberIds))
    throw new ClientError(
      400,
      'team member ids must be passed in as ObjectId[]'
    );

  for (let teamMemberId of teamMemberIds) {
    if (!doesDocumentWithIdExist(teamMemberId, 'TeamMember'))
      throw new ClientError(
        404,
        `teamMember with id ${teamMemberId} not found`
      );
  }

  ccc.teamMembers.push(...teamMemberIds.map(ObjectId));
}

function removeTrials(ccc: Doc<Ccc>, trialIds: any): void {
  if (!isArrayOfStrings(trialIds))
    throw new ClientError(400, 'trial ids must be passed in as ObjectId[]');

  for (let trialId of trialIds) {
    ccc.trials.splice(ccc.trials.indexOf(ObjectId(trialId)));
  }
}

function removeSites(ccc: Doc<Ccc>, siteIds: any): void {
  if (!isArrayOfStrings(siteIds))
    throw new ClientError(400, 'site ids must be passed in as ObjectId[]');

  for (let siteId of siteIds) {
    ccc.sites.splice(ccc.sites.indexOf(ObjectId(siteId)));
  }
}

function removeTeamMembers(ccc: Doc<Ccc>, teamMemberIds: any): void {
  if (!isArrayOfStrings(teamMemberIds))
    throw new ClientError(
      400,
      'team member ids must be passed in as ObjectId[]'
    );

  for (let teamMemberId of teamMemberIds) {
    ccc.teamMembers.splice(ccc.teamMembers.indexOf(ObjectId(teamMemberId)));
  }
}
