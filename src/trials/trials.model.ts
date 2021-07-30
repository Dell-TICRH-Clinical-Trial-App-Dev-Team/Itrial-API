import mongoose, { Document, Schema } from "mongoose";
import {
  ITrialProtocol,
  TrialProtocolSchema,
} from "./trialProtocols/trialProtocols.model";

interface ITrial extends Document {
  name: string;
  endpointResults?: string;
  protocols?: [ITrialProtocol];
  permissions?: [string];
  blinded?: boolean;
  sites?: [Schema.Types.ObjectId];
  teamMembers?: [Schema.Types.ObjectId];
  groups?: [Schema.Types.ObjectId];
  patients?: [Schema.Types.ObjectId];
}

interface TrialModel extends mongoose.Model<ITrial> {
  build(attr: ITrial): any;
}

const trialSchema = new Schema<ITrial, TrialModel>({
  name: {
    type: String,
    required: true,
  },
  endpointResults: {
    type: String,
  },
  protocols: {
    type: [TrialProtocolSchema],
  },
  permissions: {
    type: [String],
  },
  blinded: {
    type: Boolean,
  },
  sites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Site",
    },
  ],
  teamMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "TeamMember",
    },
  ],
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  patients: [
    {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],
});

trialSchema.statics.build = (attr: ITrial) => {
  return new Trial(attr);
};

const Trial = mongoose.model<ITrial, TrialModel>("Trial", trialSchema);

export { Trial, ITrial };
