import { prop, Ref, DocumentType as Doc } from '@typegoose/typegoose';
import { Model, ModelClass, CorrespondingEdge} from '../utils/utils';
import { Trial } from '../trials/trials.model';
import { Site } from '../sites/sites.model';

class TeamMember {
  // simple fields

  @prop({ required: true })
  name: string;

  @prop()
  address?: string;

  @prop({ required: true })
  email: string;

  @prop()
  phoneNumber?: number;

  // single edge fields

  @prop({ ref: () => TeamMember })
  ccc?: Ref<TeamMember>;

  // multi edge fields

  @prop({ required: true, ref: () => Trial })
  trials: Ref<Trial>[];

  @prop({ required: true, ref: () => Site })
  sites: Ref<Site>[];

  public static async build(
    this: Model<TeamMember>,
    obj: TeamMember
  ): Promise<Doc<TeamMember>> {
    return await new this(obj).save();
  }

  public static getSortPriorities(this: unknown): string[] {
    return 'ObjectId'.split(' ');
  }

  public static getSimpleFields(this: unknown): string[] {
    return 'name address email phoneNumber'.split(' ');
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
      ccc: { model: TeamMember },
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
      trials: { model: Trial, target: 'teamMembers', targetMulti: true },
      sites: { model: Site, target: 'teamMembers', targetMulti: true },
    };
  }
}

export { TeamMember };
