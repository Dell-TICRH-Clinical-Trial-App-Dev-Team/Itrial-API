import {
  prop,
  Ref,
  ReturnModelType as Model,
  DocumentType as Doc,
} from '@typegoose/typegoose';
import { EndpointModel } from '../models';
import { Site } from '../sites/sites.model';
import { Trial } from '../trials/trials.model';
import { Group } from '../trials/groups/groups.model';
import { Patient } from '../patients/patients.model';

class Endpoint {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  date: Date;

  @prop({ required: true })
  description: string;

  @prop()
  score?: string;

  @prop({ required: true, type: () => [String] })
  documents: string[]; // will eventually store files

  @prop({ required: true, ref: () => Site })
  site: Ref<Site>;

  @prop({ required: true, ref: () => Trial })
  trial: Ref<Trial>;

  @prop({ required: true, ref: () => Group })
  group: Ref<Group>;

  @prop({ required: true, ref: () => Patient })
  patient: Ref<Patient>;

  public static build(this: Model<typeof Endpoint>, obj: any): Doc<Endpoint> {
    return new EndpointModel(obj);
  }
}

export { Endpoint };
