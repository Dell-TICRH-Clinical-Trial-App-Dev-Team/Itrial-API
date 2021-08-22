import { NativeError, ObjectId } from 'mongoose';
import { Patient, IPatient } from './patients.model';

import { doesDocumentWithIdExist, isArrayOfStrings } from '../utils/utils';

const updateFunctions = new Map([
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
const updateOptions = [...updateFunctions.keys()];

export async function getPatientById(id: string): Promise<IPatient> {
  return new Promise((resolve, reject) => {
    Patient.findById(id, (err: NativeError, patient: IPatient) => {
      if (err) return reject({ status: 400, message: err.message });
      else if (!patient)
        return reject({
          status: 404,
          message: `Patient with id: ${id} not found`,
        });
      else resolve(patient);
    });
  });
}

export async function getPatientByEmail(email: string): Promise<IPatient> {
  return new Promise((resolve, reject) => {
    Patient.findOne({ email: email }, (err: NativeError, patient: IPatient) => {
      if (!email.includes('@'))
        return reject({ status: 400, message: 'invalid email' });
      else if (!patient)
        return reject({
          status: 404,
          message: `Patient with email: ${email} not found`,
        });
      else resolve(patient);
    });
  });
}

export async function createPatient(newPatient: IPatient): Promise<IPatient> {
  return new Promise((resolve, reject) => {
    const patient = Patient.build(newPatient);

    patient.save((err: NativeError, newPatient: IPatient) => {
      if (err) return reject(err);
      else resolve(newPatient);
    });
  });
}

export async function updatePatient(
  id: string,
  operation: string,
  payload: any
): Promise<IPatient> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation)) {
      return reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });
    }

    var patient: IPatient = await Patient.findById(id);

    if (patient == null)
      return reject({
        status: 404,
        message: `patient with id: ${id} not found`,
      });

    try {
      updateFunctions.get(operation)(patient, payload);
    } catch (err) {
      return reject(err);
    }

    patient.save((err: NativeError, updatedPatient: IPatient) => {
      if (err) return reject({ status: 400, message: err.message });
      else resolve(updatedPatient);
    });
  });
}

function rename(patient: IPatient, name: any): void {
  if (typeof name != 'string' || name == '')
    throw { status: 400, message: 'Invalid name' };
  patient.name = name;
}

function updateAddress(patient: IPatient, address: any): void {
  if (typeof address != 'string' || address == '')
    throw { status: 400, message: 'Invalid address' };
  patient.address = address;
}

function updateEmail(patient: IPatient, email: any): void {
  if (typeof email != 'string' || email == '')
    throw { status: 400, message: 'Invalid email' };
  patient.email = email;
}

function updatePhoneNumber(patient: IPatient, phoneNumber: any): void {
  if (typeof phoneNumber != 'number' || phoneNumber < 1000000000)
    throw { status: 400, message: 'Invalid name' };
  patient.phoneNumber = phoneNumber;
}

function addEndpoints(patient: IPatient, endpoints: any): void {
  if (!isArrayOfStrings(endpoints))
    throw {
      status: 400,
      message: 'endpoints must be passed in as [ObjectId]',
    };

  patient.endpoints.push(...endpoints);
}

function removeEndpoints(patient: IPatient, endpoints: any): void {
  if (!isArrayOfStrings(endpoints))
    throw {
      status: 400,
      message: 'endpoints must be passed in as [ObjectId]',
    };

  endpoints.forEach((endpointid: ObjectId) => {
    patient.endpoints.splice(patient.endpoints.indexOf(endpointid));
  });
}

function addDocuments(patient: IPatient, documents: any): void {
  if (!isArrayOfStrings(documents))
    throw {
      status: 400,
      message: 'documents must be passed in as [string]',
    };

  patient.documents.push(...documents);
}

function removeDocuments(patient: IPatient, documents: any): void {
  if (!isArrayOfStrings(documents))
    throw {
      status: 400,
      message: 'documents must be passed in as [string]',
    };

  documents.forEach((document: string) => {
    patient.documents.splice(patient.documents.indexOf(document));
  });
}

function changeSite(patient: IPatient, siteid: any): void {
  if (!doesDocumentWithIdExist(siteid, 'Site'))
    throw { status: 404, message: `site with id ${siteid} not found` };
  patient.site = siteid;
}

function changeTrial(patient: IPatient, trialid: any): void {
  if (!doesDocumentWithIdExist(trialid, 'Trial'))
    throw { status: 404, message: `trial with id ${trialid} not found` };
  patient.trial = trialid;
}

function changeGroup(patient: IPatient, groupid: any): void {
  if (!doesDocumentWithIdExist(groupid, 'Group'))
    throw { status: 404, message: `group with id ${groupid} not found` };
  patient.group = groupid;
}
