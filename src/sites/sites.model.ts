import { prop, Ref, DocumentType as Doc } from '@typegoose/typegoose';
import { Model } from '../utils/utils';
import { Trial } from '../trials/trials.model';
import { TeamMember } from '../teamMembers/teamMembers.model';

class Site {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  address: string;

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

  public static getSortString(this: unknown): string {
    return 'ObjectId';
  }

  public static getSelectString(this: unknown): string {
    return 'name address';
  }

  public static getSinglePopulateStrings(
    this: unknown
  ): Record<string, string> {
    return {};
  }

  public static getMultiPopulateStrings(
    this: unknown
  ): Record<string, string> {
    return {
      trials: Trial.getSelectString(),
      teamMembers: TeamMember.getSelectString(),
      cccs: TeamMember.getSelectString(),
    };
  }
}

export { Site };
