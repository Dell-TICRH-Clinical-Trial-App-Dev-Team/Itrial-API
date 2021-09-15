import { prop, Ref, DocumentType as Doc } from '@typegoose/typegoose';
import { Model } from '../utils/utils';
import { Group } from '../groups/groups.model';
import { Patient } from '../patients/patients.model';
import { Site } from '../sites/sites.model';
import { Trial } from '../trials/trials.model';
import { DocumentFile } from '../utils/model';

class Endpoint {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  date: Date;

  @prop({ required: true })
  description: string;

  @prop()
  score?: string;

  @prop({ required: true, type: () => [DocumentFile] })
  documents: DocumentFile[]; // will eventually store files

  @prop({ required: true, ref: () => Site })
  site: Ref<Site>;

  @prop({ required: true, ref: () => Trial })
  trial: Ref<Trial>;

  @prop({ required: true, ref: () => Group })
  group: Ref<Group>;

  @prop({ required: true, ref: () => Patient })
  patient: Ref<Patient>;

  public static async build(
    this: Model<Endpoint>,
    obj: any
  ): Promise<Doc<Endpoint>> {
    return await new this(obj).save();
  }

  public static getSortString(this: unknown): string {
    return 'ObjectId';
  }

  public static getSelectString(this: unknown): string {
    return 'name date description score';
  }

  public static getSinglePopulateStrings(
    this: unknown
  ): Record<string, string> {
    return {
      site: Site.getSelectString(),
      trial: Trial.getSelectString(),
      group: Group.getSelectString(),
      patient: Patient.getSelectString(),
    };
  }

  public static getMultiPopulateStrings(
    this: unknown
  ): Record<string, string> {
    return {};
  }
}

export { Endpoint };
