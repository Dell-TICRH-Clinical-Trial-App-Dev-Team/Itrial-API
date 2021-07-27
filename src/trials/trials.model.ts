import mongoose, { Schema } from "mongoose";
import {
  TrialProtocol,
  TrialProtocolSchema,
} from "./trialProtocols/trialProtocols.model";

interface ITrial {
  name: string;
  endpointResults: string;
  protocols: [TrialProtocol];
  permissions: [string];
  blinded: boolean;
  sites: [Schema.Types.ObjectId];
  teamMembers: [Schema.Types.ObjectId];
  groups: [Schema.Types.ObjectId];
  patients: [Schema.Types.ObjectId];
}

interface trialModelInterface extends mongoose.Model<any> {
  build(attr: ITrial): any;
}

const trialSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  endpointResults: {
    type: String,
    required: false,
  },
  protocols: {
    type: [TrialProtocolSchema],
    required: true,
  },
  permissions: {
    type: [String],
    required: true,
  },
  blinded: {
    type: Boolean,
    required: false,
  },
  sites: {
    type: [Schema.Types.ObjectId],
    ref: "Site",
    // required: true,
  },
  teamMembers: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: "TeamMember",
    // required: true,
  },
  groups: {
    type: [Schema.Types.ObjectId],
    ref: "Group",
    // required: true,
  },
  patients: {
    type: [Schema.Types.ObjectId],
    ref: "Patient",
    // required: true,
  },
});

trialSchema.statics.build = (attr: ITrial) => {
  return new Trial(attr);
};

const Trial = mongoose.model<any, trialModelInterface>("Trial", trialSchema);

export { Trial };
