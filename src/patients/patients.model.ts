import { prop, Ref, ReturnModelType as Model, DocumentType as Doc } from '@typegoose/typegoose';
import { PatientModel } from '../models';
import { Endpoint } from '../endpoints/endpoints.model';
import { Group } from '../trials/groups/groups.model';
import { Site } from '../sites/sites.model';
import { Trial } from '../trials/trials.model';

class Patient {
  @prop({ required: true })
  dccid: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  address: string;

  @prop({ required: true })
  email: string;

  @prop({ required: true })
  phoneNumber: number;

  @prop({ required: true })
  consentForm: string; // will eventually be a file

  @prop({ required: true })
  screenFail: boolean;
  
  @prop({ required: true, type: () => [String] })
  documents: string[]; // will eventually be an array of files


  @prop({ required: true, ref: () => Endpoint })
  endpoints: Ref<Endpoint>[];

  @prop({ ref: () => Group })
  group?: Ref<Group>;

  @prop({ ref: () => Site })
  site?: Ref<Site>;

  @prop({ ref: () => Trial })
  trial?: Ref<Trial>;


  public static build(this: Model<typeof Patient>, obj: Patient): Doc<Patient> {
    return new PatientModel(obj);
  }
}

export { Patient };
