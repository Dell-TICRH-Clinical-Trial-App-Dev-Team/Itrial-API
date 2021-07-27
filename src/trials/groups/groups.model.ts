import mongoose, { Schema } from "mongoose";

interface IGroup {
  name: string;
  endpointResults: string;
  patients: [Schema.Types.ObjectId];
  sites: [Schema.Types.ObjectId];
  trials: [Schema.Types.ObjectId];
}

interface groupModelInterface extends mongoose.Model<any> {
  build(attr: IGroup): any;
}

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  endpointResults: {
    type: String,
    required: false,
  },
  sites: {
    type: [Schema.Types.ObjectId],
    ref: "Site",
    // required: true,
  },
  trials: {
    type: [Schema.Types.ObjectId],
    ref: "Trial",
    // required: true,
  },
  patients: {
    type: [Schema.Types.ObjectId],
    ref: "Patient",
    // required: true,
  },
});

groupSchema.statics.build = (attr: IGroup) => {
  return new Group(attr);
};

const Group = mongoose.model<any, groupModelInterface>("Group", groupSchema);

export { Group };
