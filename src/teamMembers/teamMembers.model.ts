import { prop, Ref, DocumentType as Doc } from '@typegoose/typegoose';
import { Model } from '../utils/utils';
import { Trial } from '../trials/trials.model';
import { Site } from '../sites/sites.model';

class TeamMember {
  @prop({ required: true })
  name: string;

  @prop()
  address?: string;

  @prop({ required: true })
  email: string;

  @prop()
  phoneNumber?: number;

  @prop({ required: true, ref: () => Trial })
  trials: Ref<Trial>[];

  @prop({ required: true, ref: () => Site })
  sites: Ref<Site>[];

  @prop({ ref: () => TeamMember })
  ccc: Ref<TeamMember>;

  public static async build(
    this: Model<TeamMember>,
    obj: TeamMember
  ): Promise<Doc<TeamMember>> {
    return await new this(obj).save();
  }

  public static getSortString(this: unknown): string {
    return 'ObjectId';
  }

  public static getSelectString(this: unknown): string {
    return 'name address email phoneNumber';
  }

  public static getSinglePopulateStrings(
    this: unknown
  ): Record<string, string> {
    return {
      ccc: Trial.getSelectString(),
    };
  }

  public static getMultiPopulateStrings(
    this: unknown
  ): Record<string, string> {
    return {
      trials: Trial.getSelectString(),
      sites: Site.getSelectString(),
    };
  }
}

export { TeamMember };
