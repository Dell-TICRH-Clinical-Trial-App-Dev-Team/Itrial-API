import {
  prop,
  Ref,
  DocumentType as Doc,
  Severity,
  modelOptions,
} from '@typegoose/typegoose';
import { Model } from '../utils/utils';
import { Site } from '../sites/sites.model';
import { TeamMember } from '../teamMembers/teamMembers.model';
import { Group } from '../groups/groups.model';
import { Patient } from '../patients/patients.model';

type TrialStatus = 'started' | 'pending' | 'ended';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
class EndpointInfo {
  @prop({ required: true })
  type: 'quantitative' | 'qualitative' | 'file';

  @prop()
  range?: [string | number, string | number];

  @prop()
  url?: string;
}

class Intervention {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop({ required: false })
  amount?: string;

  @prop({ required: true, type: () => [String] })
  timing: string[];

  @prop({ required: true, ref: () => Group })
  groups: Ref<Group>[];
}

class TrialProtocol {
  @prop({ required: true })
  name: string;

  @prop({ required: true, type: () => [Intervention] })
  interventions: Intervention[];

  @prop()
  endpointInfo?: EndpointInfo;
}

class Trial {
  @prop({ required: true })
  name: string;

  @prop()
  startDate?: Date;

  @prop()
  endDate?: string;

  @prop()
  endpointResults?: string;

  @prop()
  blinded?: boolean;

  @prop({ required: true })
  status: TrialStatus;

  @prop({ required: true, type: () => [TrialProtocol] })
  protocols: TrialProtocol[];

  @prop({ required: true, ref: () => Site })
  sites: Ref<Site>[];

  @prop({ required: true, ref: () => TeamMember })
  cccs: Ref<TeamMember>[];

  @prop({ required: true, ref: () => TeamMember })
  teamMembers: Ref<TeamMember>[];

  @prop({ required: true, ref: () => Group })
  groups: Ref<Group>[];

  @prop({ required: true, ref: () => Patient })
  patients: Ref<Patient>[];

  public static async build(
    this: Model<Trial>,
    obj: Trial
  ): Promise<Doc<Trial>> {
    return await new this(obj).save();
  }

  public static getSortString(this: unknown): string {
    return 'ObjectId';
  }

  public static getSelectString(this: unknown): string {
    return 'name startDate endDate endpointResults blinded status';
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
      sites: Site.getSelectString(),
      cccs: TeamMember.getSelectString(),
      teamMembers: TeamMember.getSelectString(),
      groups: Group.getSelectString(),
      patients: Patient.getSelectString(),
    };
  }
}

export { Trial, TrialStatus, EndpointInfo, Intervention, TrialProtocol };
