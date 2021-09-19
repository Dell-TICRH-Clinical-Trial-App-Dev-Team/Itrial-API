import { prop, Ref, DocumentType as Doc } from '@typegoose/typegoose';
import { Model, ModelClass, CorrespondingEdge } from '../utils/utils';
import { Endpoint } from '../endpoints/endpoints.model';
import { Group } from '../groups/groups.model';
import { Site } from '../sites/sites.model';
import { Trial } from '../trials/trials.model';
import { DocumentFile } from '../utils/model';

class Patient {
  // simple fields

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
  screenFail: boolean;

  // subdocument fields

  @prop({ required: true })
  consentForm: DocumentFile;

  // single edge fields

  @prop({ ref: () => Group })
  group?: Ref<Group>;

  @prop({ ref: () => Site })
  site?: Ref<Site>;

  @prop({ ref: () => Trial })
  trial?: Ref<Trial>;

  // subcollection fields

  @prop({ required: true, type: () => [DocumentFile] })
  documents: DocumentFile[]; // will eventually be an array of files

  // multi edge fields

  @prop({ required: true, ref: () => Endpoint })
  endpoints: Ref<Endpoint>[];

  public static async build(
    this: Model<Patient>,
    obj: Patient
  ): Promise<Doc<Patient>> {
    return await new this(obj).save();
  }

  public static getSortPriorities(this: unknown): string[] {
    return 'ObjectId'.split(' ');
  }

  public static getSimpleFields(this: unknown): string[] {
    return 'dccid name address email phoneNumber screenFail'.split(' ');
  }

  public static getSubdocumentFieldMap(
    this: unknown
  ): Record<string, ModelClass> {
    return {
      consentForm: DocumentFile,
    };
  }

  public static getSingleEdgeFieldMap(
    this: unknown
  ): Record<string, CorrespondingEdge> {
    return {
      group: { model: Group, target: 'patients', targetMulti: true },
      site: { model: Site },
      trial: { model: Trial, target: 'patients', targetMulti: true },
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
    return {
      endpoints: { model: Endpoint, target: 'patient' },
    };
  }
}

export { Patient };
