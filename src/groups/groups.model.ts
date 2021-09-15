import { prop, Ref, DocumentType as Doc } from '@typegoose/typegoose';
import { Model } from '../utils/utils';
import { Site } from '../sites/sites.model';
import { Patient } from '../patients/patients.model';
import { Trial } from '../trials/trials.model';

class Group {
  @prop({ required: true })
  name: string;

  @prop()
  endpointResults?: string;

  @prop({ ref: () => Trial })
  trial?: Ref<Trial>;

  @prop({ required: true, ref: () => Patient })
  patients: Ref<Patient>[];

  @prop({ required: true, ref: () => Site })
  sites: Ref<Site>[];

  public static async build(
    this: Model<Group>,
    obj: Trial
  ): Promise<Doc<Group>> {
    return await new this(obj).save();
  }

  public static getSortString(this: unknown): string {
    return 'ObjectId';
  }

  public static getSelectString(this: unknown): string {
    return 'name endpointResults';
  }

  public static getSinglePopulateStrings(
    this: unknown
  ): Record<string, string> {
    return {
      trial: Trial.getSelectString(),
    };
  }

  public static getMultiPopulateStrings(
    this: unknown
  ): Record<string, string> {
    return {
      sites: Site.getSelectString(),
      patients: Patient.getSelectString(),
    };
  }
}

export { Group };
