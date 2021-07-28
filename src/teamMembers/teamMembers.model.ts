import mongoose, { Schema } from "mongoose";

interface ITeamMember {
  name: string;
  address: string;
  email: string;
  phone: number;
  permissions: [string];
  trials: [Schema.Types.ObjectId];
  sites: [Schema.Types.ObjectId];
  cccs: [Schema.Types.ObjectId];
}

interface teamMemberModelInterface extends mongoose.Model<any> {
  build(attr: ITeamMember): any;
}

const teamMemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  permissions: {
    type: [String],
    // required: true
  },
  trials: [
    {
      type: Schema.Types.ObjectId,
      ref: "Trial",
      // required: true,
    },
  ],
  sites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Site",
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

teamMemberSchema.statics.build = (attr: ITeamMember) => {
  return new TeamMember(attr);
};

const TeamMember = mongoose.model<any, teamMemberModelInterface>(
  "TeamMember",
  teamMemberSchema
);

export { TeamMember };
