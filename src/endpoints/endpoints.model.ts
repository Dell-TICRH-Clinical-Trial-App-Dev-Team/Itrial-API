import mongoose, { Schema } from "mongoose";

interface IEndpoint {
  name: string;
  date: Date;
  description: string;
  score: string;
  documents: [String]; // will eventually store files
  teamMembers: [Schema.Types.ObjectId];
  groups: [Schema.Types.ObjectId];
  patients: [Schema.Types.ObjectId];
}

interface endpointModelInterface extends mongoose.Model<any> {
  build(attr: IEndpoint): any;
}

const endpointSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
  documents: {
    type: [String],
    required: false,
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

endpointSchema.statics.build = (attr: IEndpoint) => {
  return new Endpoint(attr);
};

const Endpoint = mongoose.model<any, endpointModelInterface>(
  "Endpoint",
  endpointSchema
);

export { Endpoint };
