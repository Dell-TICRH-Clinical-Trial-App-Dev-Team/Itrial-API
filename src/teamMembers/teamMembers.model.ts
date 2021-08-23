import mongoose, { Document, Schema } from 'mongoose';

interface ITeamMember extends Document {
  name: string;
  address?: string;
  email: string;
  phoneNumber?: number;
  permissions?: [string];
  trials?: [Schema.Types.ObjectId];
  sites?: [Schema.Types.ObjectId];
  cccs?: [Schema.Types.ObjectId];
}

interface TeamMemberModel extends mongoose.Model<any> {
  build(attr: ITeamMember): any;
}

const teamMemberSchema = new Schema<ITeamMember, TeamMemberModel>({
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
  phoneNumber: {
    type: Number,
    required: true,
  },
  permissions: {
    type: [String],
  },
  trials: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Trial',
    },
  ],
  sites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Site',
    },
  ],
  cccs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CentralCoordinatingCenter',
    },
  ],
});

teamMemberSchema.statics.build = (attr: ITeamMember) => {
  return new TeamMember(attr);
};

const TeamMember = mongoose.model<ITeamMember, TeamMemberModel>(
  'TeamMember',
  teamMemberSchema
);

export { TeamMember, ITeamMember };
