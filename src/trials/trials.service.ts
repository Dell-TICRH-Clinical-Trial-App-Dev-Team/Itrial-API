import { DocumentType as Doc } from '@typegoose/typegoose';

import {
  doesDocumentWithIdExist,
  isArrayOfStrings,
  ClientError,
  ObjectId,
} from '../utils/utils';

import { Trial } from './trials.model';
import { TrialProtocol } from './trialProtocols/trialProtocols.model';

export const updateFunctions = new Map([
  ['rename', rename],
  ['update endpointResults', updateEndpointResults],
  ['add protocols', addProtocols],
  ['remove protocols', removeProtocols],
  ['set protocols', setProtocols],
  ['update blinded', updateBlinded],
  ['add cccs', addCccs],
  ['add sites', addSites],
  ['add teamMembers', addTeamMembers],
  ['add groups', addGroups],
  ['add patients', addPatients],
  ['remove cccs', removeCccs],
  ['remove sites', removeSites],
  ['remove teamMembers', removeTeamMembers],
  ['remove groups', removeGroups],
  ['remove patients', removePatients],
]);

function rename(trial: Doc<Trial>, name: any): void {
  if (typeof name != 'string' || name == '')
    throw new ClientError(400, 'invalid name');
  trial.name = name;
}

function updateBlinded(trial: Doc<Trial>, blinded: any): void {
  if (typeof blinded != 'boolean')
    throw new ClientError(400, 'blinded must be a boolean');
  trial.blinded = blinded;
}

function updateEndpointResults(trial: Doc<Trial>, endpointResults: any): void {
  if (typeof endpointResults != 'string')
    throw new ClientError(400, 'endpointResults must be a string');
  trial.endpointResults = endpointResults;
}

function addTeamMembers(trial: Doc<Trial>, teamMembers: any): void {
  if (!isArrayOfStrings(teamMembers))
    throw new ClientError(400, 'teamMembers must be passed in as [ObjectId]');

  for (let teamMemberId of teamMembers) {
    if (!doesDocumentWithIdExist(teamMemberId, 'TeamMember'))
      throw new ClientError(
        404,
        `teamMember with id ${teamMemberId} not found`
      );
  }

  trial.teamMembers.push(...teamMembers.map(ObjectId));
}

function removeTeamMembers(trial: Doc<Trial>, teamMembers: any): void {
  if (!isArrayOfStrings(teamMembers))
    throw new ClientError(400, 'teamMembers must be passed in as [ObjectId]');

  for (let teamMemberId of teamMembers) {
    trial.teamMembers.splice(trial.teamMembers.indexOf(ObjectId(teamMemberId)));
  }
}

function addCccs(trial: Doc<Trial>, cccs: any): void {
  if (!isArrayOfStrings(cccs))
    throw new ClientError(400, 'cccs must be passed in as [ObjectId]');

  for (let cccid of cccs) {
    if (!doesDocumentWithIdExist(cccid, 'TeamMember'))
      throw new ClientError(404, `teamMember with id ${cccid} not found`);
  }

  trial.cccs.push(...cccs.map(ObjectId));
}

function removeCccs(trial: Doc<Trial>, cccs: any): void {
  if (!isArrayOfStrings(cccs))
    throw new ClientError(400, 'cccs must be passed in as [ObjectId]');

  for (let cccid of cccs) {
    trial.cccs.splice(trial.cccs.indexOf(ObjectId(cccid)));
  }
}

function addProtocols(trial: Doc<Trial>, protocols: any): void {
  if (!protocols[0]?.name)
    throw new ClientError(
      400,
      'protocols must be passed in as [ITrialProtcol]'
    );

  trial.protocols.push(...protocols);
}

function removeProtocols(trial: Doc<Trial>, protocols: any): void {
  if (!protocols[0]?.name)
    throw new ClientError(
      400,
      'protocols must be passed in as [ITrialProtcol]'
    );

  const filteredProtocols = trial.protocols.filter((protocol1) => {
    let shouldKeep = true;
    for (let protocol2 of protocols) {
      if (protocol1.name == protocol2.name) shouldKeep = false;
    }
    return shouldKeep;
  }) as [TrialProtocol];

  trial.protocols = filteredProtocols;
}

function setProtocols(trial: Doc<Trial>, protocols: any): void {
  if (!protocols[0]?.name)
    throw new ClientError(
      400,
      'protocols must be passed in as [ITrialProtcol]'
    );

  trial.protocols = protocols;
}

function addGroups(trial: Doc<Trial>, groups: any): void {
  if (!isArrayOfStrings(groups))
    throw new ClientError(400, 'groups must be passed in as [ObjectId]');

  for (let groupId of groups) {
    if (!doesDocumentWithIdExist(groupId, 'Group'))
      throw new ClientError(404, `group with id ${groupId} not found`);
  }

  trial.groups.push(...groups.map(ObjectId));
}

function removeGroups(trial: Doc<Trial>, groups: any): void {
  if (!isArrayOfStrings(groups))
    throw new ClientError(400, 'groups must be passed in as [ObjectId]');

  for (let groupId of groups) {
    trial.groups.splice(trial.groups.indexOf(ObjectId(groupId)));
  }
}

function addPatients(trial: Doc<Trial>, patients: any): void {
  if (!isArrayOfStrings(patients))
    throw new ClientError(400, 'patients must be passed in as [ObjectId]');

  for (let patientId of patients) {
    if (!doesDocumentWithIdExist(patientId, 'TeamMember'))
      throw new ClientError(404, `patient with id ${patientId} not found`);
  }

  trial.patients.push(...patients.map(ObjectId));
}

function removePatients(trial: Doc<Trial>, patients: any): void {
  if (!isArrayOfStrings(patients))
    throw new ClientError(400, 'patients must be passed in as [ObjectId]');

  for (let patientId of patients) {
    trial.patients.splice(trial.patients.indexOf(ObjectId(patientId)));
  }
}

function addSites(trial: Doc<Trial>, sites: any): void {
  if (!isArrayOfStrings(sites))
    throw new ClientError(400, 'sites must be passed in as [ObjectId]');

  for (let siteId of sites) {
    if (!doesDocumentWithIdExist(siteId, 'Site'))
      throw new ClientError(404, `sites with id ${siteId} not found`);
  }

  trial.sites.push(...sites.map(ObjectId));
}

function removeSites(trial: Doc<Trial>, sites: any): void {
  if (!isArrayOfStrings(sites))
    throw new ClientError(400, 'sites must be passed in as [ObjectId]');

  for (let siteId of sites) {
    trial.sites.splice(trial.sites.indexOf(ObjectId(siteId)));
  }
}
