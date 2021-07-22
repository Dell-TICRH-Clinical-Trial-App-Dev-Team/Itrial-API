import mongoose from "mongoose";

const centralCoordinatingCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sites: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  trials: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  teamMembers: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
});

mongoose.model("centralCoordinatingCenters", centralCoordinatingCenterSchema);
