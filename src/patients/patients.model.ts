import mongoose, { Schema } from "mongoose";

interface IPatient {
  dccid: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: number;
  consentForm: string; // will eventually be a file
  screenFail: boolean;
  documents: [String]; // will eventually be an array of files
  endpoints: [Schema.Types.ObjectId];
  group: [Schema.Types.ObjectId];
  site: [Schema.Types.ObjectId];
  trial: [Schema.Types.ObjectId];
}

interface patientModelInterface extends mongoose.Model<any> {
  build(attr: IPatient): any;
}

const patientSchema = new Schema({
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
    required: false,
  },
  endpoints: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: "Endpoint",
    // required: true,
  },
  site: {
    type: Schema.Types.ObjectId,
    ref: "TeamMember",
    // required: true,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    // required: true,
  },
  trial: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    // required: true,
  },
});

patientSchema.statics.build = (attr: IPatient) => {
  return new Patient(attr);
};

const Patient = mongoose.model<any, patientModelInterface>(
  "Patient",
  patientSchema
);

export { Patient };
