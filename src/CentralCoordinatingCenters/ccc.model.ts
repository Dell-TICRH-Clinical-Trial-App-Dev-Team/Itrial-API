import mongoose from "mongoose";

interface ICentralCoordinatingCenter {
  name: string;
  sites: [mongoose.Schema.Types.ObjectId];
  trials: [mongoose.Schema.Types.ObjectId];
  teamMembers: [mongoose.Schema.Types.ObjectId];
}

interface cccModelInterface extends mongoose.Model<any> {
  build(attr: ICentralCoordinatingCenter): any;
}

const centralCoordinatingCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sites: {
    type: [mongoose.Schema.Types.ObjectId],
    // required: true,
  },
  trials: {
    type: [mongoose.Schema.Types.ObjectId],
    // required: true,
  },
  teamMembers: {
    type: [mongoose.Schema.Types.ObjectId],
    // required: true,
  },
});

centralCoordinatingCenterSchema.statics.build = (
  attr: ICentralCoordinatingCenter
) => {
  return new CentralCoordinatingCenter(attr);
};

const CentralCoordinatingCenter = mongoose.model<any, cccModelInterface>(
  "CentralCoordinatingCenter",
  centralCoordinatingCenterSchema
);

export { CentralCoordinatingCenter };
