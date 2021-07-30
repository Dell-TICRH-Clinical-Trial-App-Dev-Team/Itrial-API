import { Schema, Document } from "mongoose";
import {
  IIntervention,
  InterventionSchema,
} from "../interventions/interventions.model";

/* needs some work */
export interface IEndpointInfo extends Document {
  type: "quantitative" | "qualitative" | "file";
  range?: [string | number, string | number];
  url?: string;
}

export const EndpointInfoSchema = new Schema({
  type: {
    type: String,
    enum: ["quantitative", "qualitative", "file"],
  },
  range: {
    type: [Schema.Types.Mixed],
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
});

export interface ITrialProtocol extends Document {
  name: string;
  interventions: [IIntervention];
  endpointInfo: IEndpointInfo;
}

export const TrialProtocolSchema = new Schema({
  name: String,
  interventions: [InterventionSchema],
  endpointInfo: EndpointInfoSchema,
});
