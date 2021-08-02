import { NativeError, ObjectId } from 'mongoose';
import { Endpoint, IEndpoint } from './endpoints.model';

import { isArrayOfStrings, doesDocumentWithIdExist } from '../utils/utils';

const updateFunctions = new Map([
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

const updateOptions = [...updateFunctions.keys()];

export async function getEndpointById(id: string): Promise<IEndpoint> {
  return new Promise((resolve, reject) => {
    Endpoint.findById(id, (err: NativeError, endpoint: IEndpoint) => {
      if (err) return reject({ status: 400, message: err.message });
      else if (!endpoint)
        return reject({
          status: 404,
          message: `Endpoint with id: ${id} not found`,
        });
      else resolve(endpoint);
    });
  });
}

export async function createEndpoint(
  newEndpoint: IEndpoint
): Promise<IEndpoint> {
  return new Promise((resolve, reject) => {
    const endpoint = Endpoint.build(newEndpoint);

    endpoint.save((err: NativeError, newEndpoint: IEndpoint) => {
      if (err) return reject(err);
      else resolve(newEndpoint);
    });
  });
}

export async function updateEndpoint(
  id: string,
  operation: string,
  payload: string | [String] | ObjectId
): Promise<IEndpoint> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      return reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    var endpoint: IEndpoint = await Endpoint.findById(id);
    if (endpoint == null)
      return reject({
        status: 404,
        message: `endpoint with id ${id} not found`,
      });

    try {
      updateFunctions.get(operation)(endpoint, payload);
    } catch (err) {
      return reject(err);
    }

    endpoint.save((err: NativeError, updatedEndpoint: IEndpoint) => {
      if (err) return reject({ status: 400, message: err.message });
      else resolve(updatedEndpoint);
    });
  });
}

function rename(endpoint: IEndpoint, name: any): void {
  if (typeof name != 'string' || name == '')
    throw { status: 400, message: 'Invalid name' };
  endpoint.name = name;
}

function changeDate(endpoint: IEndpoint, date: any): void {
  if (typeof date != 'string' || date == '')
    throw { status: 400, message: 'Invalid date' };

  endpoint.date = new Date(date);
}

function changeDescription(endpoint: IEndpoint, description: any): void {
  if (typeof description != 'string')
    throw { status: 400, message: 'Invalid description' };

  endpoint.description = description;
}

function updateScore(endpoint: IEndpoint, score: any): void {
  endpoint.score = score;
}

function addDocuments(endpoint: IEndpoint, documents: any): void {
  if (!isArrayOfStrings(documents))
    throw {
      status: 400,
      message: 'documents must be passed in as [string]',
    };

  endpoint.documents.push(...documents);
}

function removeDocuments(endpoint: IEndpoint, documents: any): void {
  if (!isArrayOfStrings(documents))
    throw {
      status: 400,
      message: 'documents must be passed in as [string]',
    };

  documents.forEach((document: string) => {
    endpoint.documents.splice(endpoint.documents.indexOf(document));
  });
}

function changeSite(endpoint: IEndpoint, siteid: any): void {
  if (!doesDocumentWithIdExist(siteid, 'Site'))
    throw { status: 404, message: `site with id ${siteid} not found` };

  endpoint.site = siteid;
}

function changeTrial(endpoint: IEndpoint, trialid: any): void {
  if (!doesDocumentWithIdExist(trialid, 'Trial'))
    throw { status: 404, message: `trial with id ${trialid} not found` };

  endpoint.trial = trialid;
}

function changeGroup(endpoint: IEndpoint, groupid: any): void {
  if (!doesDocumentWithIdExist(groupid, 'Group'))
    throw { status: 404, message: `group with id ${groupid} not found` };

  endpoint.group = groupid;
}

function changePatient(endpoint: IEndpoint, patientid: any): void {
  if (!doesDocumentWithIdExist(patientid, 'Patient'))
    throw { status: 404, message: `patient with id ${patientid} not found` };

  endpoint.patient = patientid;
}
