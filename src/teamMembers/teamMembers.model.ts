import {
  prop,
  Ref,
  ReturnModelType as Model,
  DocumentType as Doc,
} from '@typegoose/typegoose';
import { TeamMemberModel } from '../models';
import { Trial } from '../trials/trials.model';
import { Site } from '../sites/sites.model';
import { Ccc } from '../cccs/cccs.model';

class TeamMember {
  @prop({ required: true })
  name: string;

  @prop()
  address?: string;

  @prop({ required: true })
  email: string;

  @prop()
  phoneNumber?: number;

  @prop({ required: true, type: () => [String] })
  permissions: string[];

  @prop({ required: true, ref: () => Trial })
  trials: Ref<Trial>[];

  @prop({ required: true, ref: () => Site })
  sites: Ref<Site>[];

  @prop({ required: true, ref: () => Ccc })
  cccs: Ref<Ccc>[];

  public static build(
    this: Model<typeof TeamMember>,
    obj: TeamMember
  ): Doc<TeamMember> {
    return new TeamMemberModel(obj);
  }
}

export { TeamMember };
