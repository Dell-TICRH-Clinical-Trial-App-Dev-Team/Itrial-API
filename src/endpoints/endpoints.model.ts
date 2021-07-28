import mongoose, { Schema } from "mongoose";

interface IEndpoint {
  name: string;
  date: Date;
  description: string;
  score?: string;
  documents?: [String]; // will eventually store files
  site: Schema.Types.ObjectId;
  trial: Schema.Types.ObjectId;
  group: Schema.Types.ObjectId;
  patient: Schema.Types.ObjectId;
}

interface EndpointModel extends mongoose.Model<IEndpoint> {
  build(attr: IEndpoint): any;
}

const endpointSchema = new Schema<IEndpoint, EndpointModel>({
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
    required: false,
  },
  documents: {
    type: [String],
    required: false,
  },
  site: {
    type: Schema.Types.ObjectId,
    ref: "Site",
    required: true,
  },
  trial: {
    type: Schema.Types.ObjectId,
    ref: "Trial",
    required: true,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
});

endpointSchema.statics.build = (attr: IEndpoint) => {
  return new Endpoint(attr);
};

const Endpoint = mongoose.model<IEndpoint, EndpointModel>(
  "Endpoint",
  endpointSchema
);

export { Endpoint, IEndpoint };
