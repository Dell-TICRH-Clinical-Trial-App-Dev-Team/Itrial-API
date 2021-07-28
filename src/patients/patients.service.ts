import { Patient, IPatient } from "./patients.model";

export async function getPatientById(id: String) {
  return Patient.findById(id);
}

export async function createPatient(newPatient: IPatient) {
  const patient = Patient.build(newPatient);

  await patient.save();
  return patient;
}

export async function updatePatient(id: String, updatedPatient: IPatient) {
  return Patient.findByIdAndUpdate(id, updatedPatient);
}
