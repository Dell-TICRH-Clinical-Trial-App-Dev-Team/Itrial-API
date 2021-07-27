import mongoose, { Schema } from "mongoose";

interface ISite {
  name: string;
  address: string;
  trials: [Schema.Types.ObjectId];
  teamMembers: [Schema.Types.ObjectId];
  cccs: [Schema.Types.ObjectId];
}

interface siteModelInterface extends mongoose.Model<any> {
  build(attr: ISite): any;
}

const siteSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
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
  cccs: [
    {
      type: Schema.Types.ObjectId,
      ref: "CentralCoordinatingCenter",
      // required: true,
    },
  ],
});

siteSchema.statics.build = (attr: ISite) => {
  return new Site(attr);
};

const Site = mongoose.model<any, siteModelInterface>("Site", siteSchema);

export { Site };
