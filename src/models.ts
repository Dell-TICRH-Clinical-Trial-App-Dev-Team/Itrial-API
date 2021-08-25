import { getModelForClass } from '@typegoose/typegoose';

import { Ccc } from './cccs/cccs.model';
import { Endpoint } from './endpoints/endpoints.model';
import { Patient } from './patients/patients.model';
import { Site } from './sites/sites.model';
import { TeamMember } from './teamMembers/teamMembers.model';
import { Trial } from './trials/trials.model';
import { Group } from './trials/groups/groups.model';

const CccModel = getModelForClass(Ccc);
const EndpointModel = getModelForClass(Endpoint);
const PatientModel = getModelForClass(Patient);
const SiteModel = getModelForClass(Site);
const TeamMemberModel = getModelForClass(TeamMember);
const TrialModel = getModelForClass(Trial);
const GroupModel = getModelForClass(Group);

export {
  CccModel,
  EndpointModel,
  PatientModel,
  SiteModel,
  TeamMemberModel,
  TrialModel,
  GroupModel,
};
