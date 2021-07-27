import mongoose from "mongoose";

export interface Intervention {
  name: string;
  description: string;
  amount: string;
  timing: [String];
  groups: [mongoose.Schema.Types.ObjectId];
}

export const InterventionSchema = new mongoose.Schema({
  name: String,
  description: String,
  amount: String,
  timing: [String],
  groups: { type: [mongoose.Schema.Types.ObjectId], required: false },
});
