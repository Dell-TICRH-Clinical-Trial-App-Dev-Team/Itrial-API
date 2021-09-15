import { getModelForClass } from '@typegoose/typegoose';

import { Endpoint } from './endpoints/endpoints.model';
import { Patient } from './patients/patients.model';
import { Site } from './sites/sites.model';
import { TeamMember } from './teamMembers/teamMembers.model';
import { Trial } from './trials/trials.model';
import { Group } from './groups/groups.model';

const EndpointModel = getModelForClass(Endpoint);
const PatientModel = getModelForClass(Patient);
const SiteModel = getModelForClass(Site);
const TeamMemberModel = getModelForClass(TeamMember);
const TrialModel = getModelForClass(Trial);
const GroupModel = getModelForClass(Group);

export {
  EndpointModel,
  PatientModel,
  SiteModel,
  TeamMemberModel,
  TrialModel,
  GroupModel,
};
