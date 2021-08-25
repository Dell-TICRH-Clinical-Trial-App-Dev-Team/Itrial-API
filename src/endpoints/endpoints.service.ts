import { DocumentType as Doc } from '@typegoose/typegoose';

import {
  doesDocumentWithIdExist,
  isArrayOfStrings,
  ClientError,
} from '../utils/utils';

import { Endpoint } from './endpoints.model';

export const updateFunctions = new Map([
  ['rename', rename],
  ['change date', changeDate],
  ['change description', changeDescription],
  ['update score', updateScore],
  ['add documents', addDocuments],
  ['remove documents', removeDocuments],
  ['change site', changeSite],
  ['change trial', changeTrial],
  ['change group', changeGroup],
  ['change patient', changePatient],
]);

function rename(endpoint: Doc<Endpoint>, name: any): void {
  if (typeof name != 'string' || name == '')
    throw new ClientError(400, 'invalid name');
  endpoint.name = name;
}

function changeDate(endpoint: Doc<Endpoint>, date: any): void {
  if (typeof date != 'string' || date == '')
    throw new ClientError(400, 'invalid date');

  endpoint.date = new Date(date);
}

function changeDescription(endpoint: Doc<Endpoint>, description: any): void {
  if (typeof description != 'string')
    throw new ClientError(400, 'invalid description');

  endpoint.description = description;
}

function updateScore(endpoint: Doc<Endpoint>, score: any): void {
  endpoint.score = score;
}

function addDocuments(endpoint: Doc<Endpoint>, documents: any): void {
  if (!isArrayOfStrings(documents))
    throw new ClientError(400, 'documents must be passed in as string[]');

  endpoint.documents.push(...documents);
}

function removeDocuments(endpoint: Doc<Endpoint>, documents: any): void {
  if (!isArrayOfStrings(documents))
    throw new ClientError(400, 'documents must be passed in as string[]');

  for (let document of documents) {
    endpoint.documents.splice(endpoint.documents.indexOf(document));
  }
}

function changeSite(endpoint: Doc<Endpoint>, siteId: any): void {
  if (!doesDocumentWithIdExist(siteId, 'Site'))
    throw new ClientError(404, `site with id "${siteId}" not found`);

  endpoint.site = siteId;
}

function changeTrial(endpoint: Doc<Endpoint>, trialId: any): void {
  if (!doesDocumentWithIdExist(trialId, 'Trial'))
    throw new ClientError(404, `trial with id "${trialId}" not found`);

  endpoint.trial = trialId;
}

function changeGroup(endpoint: Doc<Endpoint>, groupId: any): void {
  if (!doesDocumentWithIdExist(groupId, 'Group'))
    throw new ClientError(404, `group with id "${groupId}" not found`);

  endpoint.group = groupId;
}

function changePatient(endpoint: Doc<Endpoint>, patientId: any): void {
  if (!doesDocumentWithIdExist(patientId, 'Patient'))
    throw new ClientError(404, `patient with id "${patientId}" not found`);

  endpoint.patient = patientId;
}
