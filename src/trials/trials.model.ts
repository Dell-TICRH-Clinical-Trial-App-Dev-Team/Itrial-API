import { prop, Ref, DocumentType as Doc } from '@typegoose/typegoose';
import { Model, ModelClass, CorrespondingEdge } from '../utils/utils';
import { Site } from '../sites/sites.model';
import { TeamMember } from '../teamMembers/teamMembers.model';
import { Group } from '../groups/groups.model';
import { Patient } from '../patients/patients.model';
import { Intervention } from './interventions/interventions.model';
import {
  TrialProtocol,
  EndpointInfo,
} from './trialProtocols/trialProtocols.model';

type TrialStatus = 'started' | 'pending' | 'ended';

class Trial {
  // simple fields

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

  // subcollection fields

  @prop({ required: true, type: () => [TrialProtocol] })
  protocols: TrialProtocol[];

  // multi edge fields

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

  public static getSortPriorities(this: unknown): string[] {
    return 'ObjectId'.split(' ');
  }

  public static getSimpleFields(this: unknown): string[] {
    return 'name startDate endDate endpointResults blinded status'.split(' ');
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
    return {
      protocols: TrialProtocol,
    };
  }

  public static getMultiEdgeFieldMap(
    this: unknown
  ): Record<string, CorrespondingEdge> {
    return {
      sites: { model: Site, target: 'trials', targetMulti: true },
      cccs: { model: TeamMember },
      teamMembers: { model: TeamMember, target: 'trials', targetMulti: true },
      groups: { model: Group, target: 'trial' },
      patients: { model: Patient, target: 'trial' },
    };
  }
}

export { Trial, TrialStatus, EndpointInfo, Intervention, TrialProtocol };
