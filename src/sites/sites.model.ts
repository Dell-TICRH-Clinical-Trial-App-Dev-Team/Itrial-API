import { prop, Ref, DocumentType as Doc } from '@typegoose/typegoose';
import { Model, ModelClass, CorrespondingEdge } from '../utils/utils';
import { Trial } from '../trials/trials.model';
import { TeamMember } from '../teamMembers/teamMembers.model';

class Site {
  // simple fields

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  address: string;

  // multi edge fields

  @prop({ required: true, ref: () => Trial })
  trials: Ref<Trial>[];

  @prop({ required: true, ref: () => TeamMember })
  teamMembers: Ref<TeamMember>[];

  @prop({ required: true, ref: () => TeamMember })
  cccs: Ref<TeamMember>[];

  public static async build(
    this: Model<Site>,
    obj: Site
  ): Promise<Doc<Site>> {
    return await new this(obj).save();
  }

  public static getSortPriorities(this: unknown): string[] {
    return 'ObjectId'.split(' ');
  }

  public static getSimpleFields(this: unknown): string[] {
    return 'name address'.split(' ');
  }

  public static getSubdocumentFieldMap(
    this: unknown
  ): Record<string, ModelClass> {
    return {};
  }

  public static getSingleEdgeFieldMap(
    this: unknown
  ): Record<string, CorrespondingEdge> {
    return {};
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
      trials: { model: Trial, target: 'sites', targetMulti: true },
      teamMembers: { model: TeamMember, target: 'sites', targetMulti: true },
      cccs: { model: TeamMember },
    };
  }
}

export { Site };
