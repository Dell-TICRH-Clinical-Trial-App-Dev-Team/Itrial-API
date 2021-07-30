import mongoose, { Schema, Document } from 'mongoose';

interface IGroup extends Document {
  name: string;
  endpointResults?: string;
  patients?: [Schema.Types.ObjectId];
  sites?: [Schema.Types.ObjectId];
  trial?: Schema.Types.ObjectId;
}

interface GroupModel extends mongoose.Model<IGroup> {
  build(attr: IGroup): any;
}

const groupSchema = new Schema<IGroup, GroupModel>({
  name: {
    type: String,
    required: true,
  },
  endpointResults: {
    type: String,
  },
  sites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Site',
    },
  ],
  trial: {
    type: Schema.Types.ObjectId,
    ref: 'Trial',
  },
  patients: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
    },
  ],
});

groupSchema.statics.build = (attr: IGroup) => {
  return new Group(attr);
};

const Group = mongoose.model<IGroup, GroupModel>('Group', groupSchema);

export { Group, IGroup };
