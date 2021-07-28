import { ITeamMember, TeamMember } from "./teamMembers.model";

export async function getTeamMemberById(id: String) {
  return TeamMember.findById(id);
}

export async function createTeamMember(newTeamMember: ITeamMember) {
  const teamMember = TeamMember.build(newTeamMember);

  await teamMember.save();
  return teamMember;
}

export async function updateTeamMember(
  id: String,
  updatedTeamMember: ITeamMember
) {
  return TeamMember.findByIdAndUpdate(id, updatedTeamMember);
}
