import {
  prop,
  Ref,
  ReturnModelType as Model,
  DocumentType as Doc,
} from '@typegoose/typegoose';
import { TrialModel } from '../models';
import { TrialProtocol } from './trialProtocols/trialProtocols.model';
import { Site } from '../sites/sites.model';
import { TeamMember } from '../teamMembers/teamMembers.model';
import { Group } from './groups/groups.model';
import { Patient } from '../patients/patients.model';

class Trial {
  @prop({ required: true })
  name: string;

  @prop()
  startDate?: Date;

  @prop()
  endDate?: string;

  @prop()
  endpointResults?: string;

  @prop({ required: true, type: () => [TrialProtocol] })
  protocols: TrialProtocol[];

  @prop()
  blinded?: boolean;

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

  @prop({ required: true })
  status: TrialStatus;

  public static build(this: Model<typeof Trial>, obj: Trial): Doc<Trial> {
    return new TrialModel(obj);
  }
}

type TrialStatus = 'started' | 'pending' | 'ended';

export { Trial, TrialStatus };
