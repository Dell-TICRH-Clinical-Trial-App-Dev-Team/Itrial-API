import { prop, Ref, ReturnModelType as Model, DocumentType as Doc } from '@typegoose/typegoose';
import { GroupModel } from '../../models';
import { Patient } from '../../patients/patients.model';
import { Site } from '../../sites/sites.model';
import { Trial } from '../../trials/trials.model';

class Group {
  @prop({ required: true })
  name: string;

  @prop()
  endpointResults?: string;


  @prop({ required: true, ref: () => Patient })
  patients: Ref<Patient>[];

  @prop({ required: true, ref: () => Site })
  sites: Ref<Site>[];

  @prop({ ref: () => Trial })
  trial?: Ref<Trial>;


  public static build(this: Model<typeof Group>, obj: Group): Doc<Group> {
    return new GroupModel(obj);
  }
}

export { Group };
