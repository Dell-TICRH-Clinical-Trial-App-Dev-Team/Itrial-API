import mongoose, { Document, Schema } from 'mongoose';

interface ICcc extends Document {
  name: string;
  sites?: [Schema.Types.ObjectId];
  trials?: [Schema.Types.ObjectId];
  teamMembers?: [Schema.Types.ObjectId];
}

interface CccModel
  extends mongoose.Model<ICcc> {
  build(ccc: ICcc): any;
}

const cccSchema = new Schema<ICcc, CccModel>({
  name: {
    type: String,
    required: true,
  },
  sites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Site',
    },
  ],
  trials: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Trial',
    },
  ],
  teamMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
    },
  ],
});

cccSchema.statics.build = (ccc: ICcc) => {
  return new Ccc(ccc);
};

const Ccc = mongoose.model<ICcc, CccModel>('Ccc', cccSchema);

export { Ccc, ICcc };
