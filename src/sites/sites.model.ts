import mongoose, { Document, Schema } from "mongoose";

interface ISite extends Document {
  name: string;
  address: string;
  trials?: [Schema.Types.ObjectId];
  teamMembers?: [Schema.Types.ObjectId];
  cccs?: [Schema.Types.ObjectId];
}

interface SiteModel extends mongoose.Model<ISite> {
  build(site: ISite): any;
}

const siteSchema = new Schema<ISite, SiteModel>({
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
    },
  ],
  teamMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "TeamMember",
    },
  ],
  cccs: [
    {
      type: Schema.Types.ObjectId,
      ref: "CentralCoordinatingCenter",
    },
  ],
});

siteSchema.statics.build = (site: ISite) => {
  return new Site(site);
};

const Site = mongoose.model<ISite, SiteModel>("Site", siteSchema);

export { Site, ISite };
