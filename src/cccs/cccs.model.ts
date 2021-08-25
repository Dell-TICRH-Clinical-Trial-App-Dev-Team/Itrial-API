import {
  prop,
  Ref,
  ReturnModelType as Model,
  DocumentType as Doc,
} from '@typegoose/typegoose';
import { CccModel } from '../models';
import { Site } from '../sites/sites.model';
import { Trial } from '../trials/trials.model';
import { TeamMember } from '../teamMembers/teamMembers.model';

class Ccc {
  @prop({ required: true })
  name: string;

  @prop({ required: true, ref: () => Site })
  sites: Ref<Site>[];

  @prop({ required: true, ref: () => Trial })
  trials: Ref<Trial>[];

  @prop({ required: true, ref: () => TeamMember })
  teamMembers: Ref<TeamMember>[];

  public static build(this: Model<typeof Ccc>, obj: Ccc): Doc<Ccc> {
    return new CccModel(obj);
  }
}

export { Ccc };
