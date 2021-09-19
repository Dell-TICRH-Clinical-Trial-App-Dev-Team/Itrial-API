import { prop, Ref, DocumentType as Doc } from '@typegoose/typegoose';
import { Model, ModelClass, CorrespondingEdge } from '../utils/utils';
import { Site } from '../sites/sites.model';
import { Patient } from '../patients/patients.model';
import { Trial } from '../trials/trials.model';

class Group {
  // simple fields

  @prop({ required: true })
  name: string;

  @prop()
  endpointResults?: string;

  // single edge fields

  @prop({ ref: () => Trial })
  trial?: Ref<Trial>;

  // multi edge fields

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

  public static getSortPriorities(this: unknown): string[] {
    return 'ObjectId'.split(' ');
  }

  public static getSimpleFields(this: unknown): string[] {
    return 'name endpointResults'.split(' ');
  }

  public static getSubdocumentFieldMap(
    this: unknown
  ): Record<string, ModelClass> {
    return {};
  }

  public static getSingleEdgeFieldMap(
    this: unknown
  ): Record<string, CorrespondingEdge> {
    return {
      trial: { model: Trial, target: 'groups', targetMulti: true },
    };
  }

  public static getSubcollectionFieldMap(
    this: unknown
  ): Record<string, ModelClass> {
    return {};
  }

  public static getMultiEdgeFieldMap(
    this: unknown
  ): Record<string, CorrespondingEdge> {
    return {
      sites: { model: Site },
      patients: { model: Patient, target: 'group' },
    };
  }
}

export { Group };
