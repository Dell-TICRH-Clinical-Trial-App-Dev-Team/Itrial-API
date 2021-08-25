import { getName, DocumentType as Doc } from '@typegoose/typegoose';

import {
  doesDocumentWithIdExist,
  isArrayOfStrings,
  ClientError,
  ObjectId,
} from '../utils/utils';

import { Patient } from './patients.model';
import { PatientModel } from '../models';

export const updateFunctions = new Map([
  ['rename', rename],
  ['update address', updateAddress],
  ['update email', updateEmail],
  ['update phoneNumber', updatePhoneNumber],
  ['add documents', addDocuments],
  ['remove documents', removeDocuments],
  ['add endpoints', addEndpoints],
  ['remove endpoints', removeEndpoints],
  ['change group', changeGroup],
  ['change site', changeSite],
  ['change trial', changeTrial],
]);

export async function getPatientByEmail(email: string): Promise<Doc<Patient>> {
  let doc = await PatientModel.findOne({ email: email }).exec();
  if (!doc)
    throw new ClientError(
      404,
      `document of type "${getName(
        PatientModel
      )}" with email "${email}" not found`
    );
  return doc;
}

function rename(patient: Doc<Patient>, name: any): void {
  if (typeof name != 'string' || name == '')
    throw new ClientError(400, 'invalid name');
  patient.name = name;
}

function updateAddress(patient: Doc<Patient>, address: any): void {
  if (typeof address != 'string' || address == '')
    throw new ClientError(400, 'invalid address');
  patient.address = address;
}

function updateEmail(patient: Doc<Patient>, email: any): void {
  if (typeof email != 'string' || email == '')
    throw new ClientError(400, 'invalid email');
  patient.email = email;
}

function updatePhoneNumber(patient: Doc<Patient>, phoneNumber: any): void {
  if (typeof phoneNumber != 'number' || phoneNumber < 1000000000)
    throw new ClientError(400, 'invalid name');
  patient.phoneNumber = phoneNumber;
}

function addEndpoints(patient: Doc<Patient>, endpoints: any): void {
  if (!isArrayOfStrings(endpoints))
    throw new ClientError(400, 'endpoints must be passed in as ObjectId[]');

  patient.endpoints.push(...endpoints.map(ObjectId));
}

function removeEndpoints(patient: Doc<Patient>, endpoints: any): void {
  if (!isArrayOfStrings(endpoints))
    throw new ClientError(400, 'endpoints must be passed in as ObjectId[]');

  for (let endpointId of endpoints) {
    patient.endpoints.splice(patient.endpoints.indexOf(ObjectId(endpointId)));
  }
}

function addDocuments(patient: Doc<Patient>, documents: any): void {
  if (!isArrayOfStrings(documents))
    throw new ClientError(400, 'documents must be passed in as string[]');

  patient.documents.push(...documents);
}

function removeDocuments(patient: Doc<Patient>, documents: any): void {
  if (!isArrayOfStrings(documents))
    throw new ClientError(400, 'documents must be passed in as string[]');

  for (let document of documents) {
    patient.documents.splice(patient.documents.indexOf(document));
  }
}

function changeSite(patient: Doc<Patient>, siteId: any): void {
  if (!doesDocumentWithIdExist(siteId, 'Site'))
    throw new ClientError(404, `site with id "${siteId}" not found`);
  patient.site = siteId;
}

function changeTrial(patient: Doc<Patient>, trialId: any): void {
  if (!doesDocumentWithIdExist(trialId, 'Trial'))
    throw new ClientError(404, `trial with id "${trialId}" not found`);
  patient.trial = trialId;
}

function changeGroup(patient: Doc<Patient>, groupId: any): void {
  if (!doesDocumentWithIdExist(groupId, 'Group'))
    throw new ClientError(404, `group with id "${groupId}" not found`);
  patient.group = groupId;
}
