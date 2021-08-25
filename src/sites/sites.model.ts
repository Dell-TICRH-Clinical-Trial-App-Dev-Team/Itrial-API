import { prop, Ref, ReturnModelType as Model, DocumentType as Doc } from '@typegoose/typegoose';
import { SiteModel } from '../models';
import { Trial } from '../trials/trials.model';
import { TeamMember } from '../teamMembers/teamMembers.model';
import { Ccc } from '../cccs/cccs.model';

class Site {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  address: string;


  @prop({ required: true, ref: () => Trial })
  trials: Ref<Trial>[];

  @prop({ required: true, ref: () => TeamMember })
  teamMembers: Ref<TeamMember>[];

  @prop({ required: true, ref: () => Ccc })
  cccs: Ref<Ccc>[];

  public static build(this: Model<typeof Site>, obj: Site): Doc<Site> {
    return new SiteModel(obj);
  }
}

export { Site };
