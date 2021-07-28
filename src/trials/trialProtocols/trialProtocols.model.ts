import mongoose from "mongoose";
import {
  IIntervention,
  InterventionSchema,
} from "../interventions/interventions.model";

/* needs some work */
export interface EndpointInfo {
  type: "quantitative" | "qualitative" | "file";
  range?: [string | number, string | number];
  url?: string;
}

export const EndpointInfoSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["quantitative", "qualitative", "file"],
  },
  range: {
    type: [mongoose.Schema.Types.Mixed],
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
});

export interface TrialProtocol {
  name: string;
  interventions: [IIntervention];
  endpointInfo: EndpointInfo;
}

export const TrialProtocolSchema = new mongoose.Schema({
  name: String,
  interventions: [InterventionSchema],
  endpointInfo: EndpointInfoSchema,
});
