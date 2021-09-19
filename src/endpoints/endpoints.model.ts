import { prop, Ref, DocumentType as Doc } from '@typegoose/typegoose';
import { ModelClass, Model, CorrespondingEdge } from '../utils/utils';
import { Group } from '../groups/groups.model';
import { Patient } from '../patients/patients.model';
import { Site } from '../sites/sites.model';
import { Trial } from '../trials/trials.model';
import { DocumentFile } from '../utils/model';

class Endpoint {
  // simple fields

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  date: Date;

  @prop({ required: true })
  description: string;

  @prop()
  score?: string;

  // single edge fields

  @prop({ ref: () => Site })
  site?: Ref<Site>;

  @prop({ ref: () => Trial })
  trial?: Ref<Trial>;

  @prop({ ref: () => Group })
  group?: Ref<Group>;

  @prop({ ref: () => Patient })
  patient?: Ref<Patient>;

  // subcollection fields

  @prop({ required: true, type: () => [DocumentFile] })
  documents: DocumentFile[]; // will eventually store files

  public static async build(
    this: Model<Endpoint>,
    obj: any
  ): Promise<Doc<Endpoint>> {
    return await new this(obj).save();
  }

  public static getSortPriorities(this: unknown): string[] {
    return 'ObjectId'.split(' ');
  }

  public static getSimpleFields(this: unknown): string[] {
    return 'name date description score'.split(' ');
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
      site: { model: Site },
      trial: { model: Trial },
      group: { model: Group },
      patient: { model: Patient, target: 'endpoints', targetMulti: true },
    };
  }

  public static getSubcollectionFieldMap(
    this: unknown
  ): Record<string, ModelClass> {
    return {
      documents: DocumentFile,
    };
  }

  public static getMultiEdgeFieldMap(
    this: unknown
  ): Record<string, CorrespondingEdge> {
    return {};
  }
}

export { Endpoint };
