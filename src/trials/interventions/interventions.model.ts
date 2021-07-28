import mongoose from "mongoose";

export interface IIntervention {
  name: string;
  description: string;
  amount?: string;
  timing?: [String];
  groups: [mongoose.Schema.Types.ObjectId];
}

export const InterventionSchema = new mongoose.Schema<IIntervention>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  amount: String,
  timing: [String],
  groups: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  ],
});
