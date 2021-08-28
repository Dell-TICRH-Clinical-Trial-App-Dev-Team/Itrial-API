import {
  prop,
  Ref,
  ReturnModelType as Model,
  DocumentType as Doc,
} from '@typegoose/typegoose';
import { TeamMemberModel } from '../models';
import { Trial } from '../trials/trials.model';
import { Site } from '../sites/sites.model';

class TeamMember {
  @prop({ required: true })
  name: string;

  @prop()
  address?: string;

  @prop({ required: true })
  email: string;

  @prop()
  phoneNumber?: number;

  @prop({ required: true, ref: () => Trial })
  trials: Ref<Trial>[];

  @prop({ required: true, ref: () => Site })
  sites: Ref<Site>[];

  @prop({ ref: () => TeamMember })
  ccc: Ref<TeamMember>;

  public static build(
    this: Model<typeof TeamMember>,
    obj: TeamMember
  ): Doc<TeamMember> {
    return new TeamMemberModel(obj);
  }
}

export { TeamMember };
