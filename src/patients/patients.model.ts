import { prop, Ref, DocumentType as Doc } from '@typegoose/typegoose';
import { Model } from '../utils/utils';
import { Endpoint } from '../endpoints/endpoints.model';
import { Group } from '../groups/groups.model';
import { Site } from '../sites/sites.model';
import { Trial } from '../trials/trials.model';
import { DocumentFile } from '../utils/model';

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
  consentForm: DocumentFile;
  
  @prop({ required: true })
  screenFail: boolean;

  @prop({ required: true, type: () => [DocumentFile] })
  documents: DocumentFile[]; // will eventually be an array of files


  @prop({ ref: () => Group })
  group?: Ref<Group>;

  @prop({ ref: () => Site })
  site?: Ref<Site>;

  @prop({ ref: () => Trial })
  trial?: Ref<Trial>;

  @prop({ required: true, ref: () => Endpoint })
  endpoints: Ref<Endpoint>[];
  
  public static async build(
    this: Model<Patient>,
    obj: Patient
  ): Promise<Doc<Patient>> {
    return await new this(obj).save();
  }

  public static getSortString(this: unknown): string {
    return 'ObjectId';
  }

  public static getSelectString(this: unknown): string {
    return 'dccid name address email phoneNumber consentForm screenFail';
  }

  public static getSinglePopulateStrings(
    this: unknown
  ): Record<string, string> {
    return {
      group: Group.getSelectString(),
      site: Site.getSelectString(),
      trial: Trial.getSelectString(),
    };
  }

  public static getMultiPopulateStrings(
    this: unknown
  ): Record<string, string> {
    return {
      endpoints: Endpoint.getSelectString(),
    };
  }
}

export { Patient };
