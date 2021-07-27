import mongoose from "mongoose";
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
  sites: [mongoose.Schema.Types.ObjectId];
  teamMembers: [mongoose.Schema.Types.ObjectId];
  groups: [mongoose.Schema.Types.ObjectId];
  patients: [mongoose.Schema.Types.ObjectId];
}

interface trialModelInterface extends mongoose.Model<any> {
  build(attr: ITrial): any;
}

const trialSchema = new mongoose.Schema({
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
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  teamMembers: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  groups: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  patients: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
});

trialSchema.statics.build = (attr: ITrial) => {
  return new Trial(attr);
};

const Trial = mongoose.model<any, trialModelInterface>("Trial", trialSchema);

export { Trial };
