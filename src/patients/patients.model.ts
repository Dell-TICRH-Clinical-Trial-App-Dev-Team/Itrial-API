import mongoose, { Schema, Document } from 'mongoose';

interface IPatient extends Document {
  dccid: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: number;
  consentForm: string; // will eventually be a file
  screenFail: boolean;
  documents?: [String]; // will eventually be an array of files
  endpoints?: [Schema.Types.ObjectId];
  group?: Schema.Types.ObjectId;
  site?: Schema.Types.ObjectId;
  trial?: Schema.Types.ObjectId;
}

interface PatientModel extends mongoose.Model<IPatient> {
  build(patient: IPatient): any;
}

const patientSchema = new Schema<IPatient, PatientModel>({
  dccid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  consentForm: {
    type: String,
    required: true,
  },
  screenFail: {
    type: Boolean,
    required: true,
  },
  documents: {
    type: [String],
  },
  endpoints: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Endpoint',
    },
  ],
  site: {
    type: Schema.Types.ObjectId,
    ref: 'Site',
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
  trial: {
    type: Schema.Types.ObjectId,
    ref: 'Trial',
  },
});

patientSchema.statics.build = (patient: IPatient) => {
  return new Patient(patient);
};

const Patient = mongoose.model<IPatient, PatientModel>(
  'Patient',
  patientSchema
);

export { Patient, IPatient };
