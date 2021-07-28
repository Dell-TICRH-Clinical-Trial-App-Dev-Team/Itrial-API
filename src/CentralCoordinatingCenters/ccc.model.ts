import mongoose, { Schema } from "mongoose";

interface ICentralCoordinatingCenter {
  name: string;
  sites?: [Schema.Types.ObjectId];
  trials?: [Schema.Types.ObjectId];
  teamMembers?: [Schema.Types.ObjectId];
}

interface CentralCoordinatingCenterModel
  extends mongoose.Model<ICentralCoordinatingCenter> {
  build(ccc: ICentralCoordinatingCenter): any;
}

const centralCoordinatingCenterSchema = new Schema<
  ICentralCoordinatingCenter,
  CentralCoordinatingCenterModel
>({
  name: {
    type: String,
    required: true,
  },
  sites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Site",
    },
  ],
  trials: [
    {
      type: Schema.Types.ObjectId,
      ref: "Trial",
    },
  ],
  teamMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "TeamMember",
    },
  ],
});

centralCoordinatingCenterSchema.statics.build = (
  ccc: ICentralCoordinatingCenter
) => {
  return new CentralCoordinatingCenter(ccc);
};

const CentralCoordinatingCenter = mongoose.model<
  ICentralCoordinatingCenter,
  CentralCoordinatingCenterModel
>("CentralCoordinatingCenter", centralCoordinatingCenterSchema);

export { CentralCoordinatingCenter, ICentralCoordinatingCenter };
