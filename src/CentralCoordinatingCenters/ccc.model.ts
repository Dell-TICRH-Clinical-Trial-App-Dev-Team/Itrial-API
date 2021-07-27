import mongoose, { Schema } from "mongoose";

interface ICentralCoordinatingCenter {
  name: string;
  sites: [Schema.Types.ObjectId];
  trials: [Schema.Types.ObjectId];
  teamMembers: [Schema.Types.ObjectId];
}

interface cccModelInterface extends mongoose.Model<any> {
  build(attr: ICentralCoordinatingCenter): any;
}

const centralCoordinatingCenterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Site",
      // required: true,
    },
  ],
  trials: [
    {
      type: Schema.Types.ObjectId,
      ref: "Trial",
      // required: true,
    },
  ],
  teamMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "TeamMember",
      // required: true,
    },
  ],
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
