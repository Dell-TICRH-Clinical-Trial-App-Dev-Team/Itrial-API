import { NativeError } from 'mongoose';
import { Patient, IPatient } from './patients.model';

const updateOptions = [
  'rename',
  'update address',
  'update email',
  'update phone number',
  'add documents',
  'add endpoints',
  'change group',
  'change site',
  'change trial',
];
export type UpdateOption = typeof updateOptions[number];

export async function getPatientById(id: string): Promise<IPatient> {
  return new Promise((resolve, reject) => {
    Patient.findById(id, (err: NativeError, patient: IPatient) => {
      if (err) reject({ status: 400, message: err.message });
      else if (!patient)
        reject({
          status: 404,
          message: `Patient with id: ${id} not found`,
        });
      else resolve(patient);
    });
  });
}

export async function createPatient(newPatient: IPatient): Promise<IPatient> {
  return new Promise((resolve, reject) => {
    const patient = Patient.build(newPatient);

    patient.save((err: NativeError, newPatient: IPatient) => {
      if (err) reject(err);
      else resolve(newPatient);
    });
  });
}

export async function updatePatient(
  id: string,
  operation: UpdateOption,
  payload: any
): Promise<IPatient> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    var patient: IPatient;
    try {
      patient = await Patient.findById(id);
    } catch (e) {
      reject({ status: 404, message: e.message });
    }

    if (Array.isArray(payload)) {
      if (typeof payload[0] == 'string' && operation == 'add documents')
        patient.documents.push(...payload);
      else if (operation == 'add endpoints') patient.endpoints.push(...payload);
    } else if (typeof payload == 'string') {
      switch (operation) {
        case 'rename':
          patient.name = payload;
          break;
        case 'update address':
          patient.address = payload;
          break;
        case 'update email':
          patient.email = payload;
          break;
      }
    } else if (
      typeof payload == 'number' &&
      operation == 'update phone number'
    ) {
      patient.phoneNumber = payload;
    } else {
      switch (operation) {
        case 'change site':
          patient.site = payload;
          break;
        case 'change trial':
          patient.trial = payload;
          break;
        case 'change group':
          patient.group = payload;
          break;
      }
    }

    patient.save((err: NativeError, updatedPatient: IPatient) => {
      if (err) reject({ status: 400, message: err.message });
      else resolve(updatedPatient);
    });
  });
}
