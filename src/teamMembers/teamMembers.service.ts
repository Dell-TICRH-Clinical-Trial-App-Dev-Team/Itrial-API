import { NativeError, ObjectId } from "mongoose";
import { TeamMember, ITeamMember } from "./teamMembers.model";

const updateOptions = [
  "rename",
  "update address",
  "update email",
  "update phoneNumber",
  "add permissions",
  "remove permissions",
  "set permissions",
  "add documents",
  "add sites",
  "add cccs",
];
export type UpdateOption = typeof updateOptions[number];

export async function getTeamMemberById(id: string): Promise<ITeamMember> {
  return new Promise((resolve, reject) => {
    TeamMember.findById(id, (err: NativeError, teamMember: ITeamMember) => {
      if (err) reject({ status: 400, message: err.message });
      else if (!teamMember)
        reject({
          status: 404,
          message: `Team Member with id: ${id} not found`,
        });
      else resolve(teamMember);
    });
  });
}

export async function createTeamMember(
  newTeamMember: ITeamMember
): Promise<ITeamMember> {
  return new Promise((resolve, reject) => {
    const teamMember = TeamMember.build(newTeamMember);

    teamMember.save((err: NativeError, newTeamMember: ITeamMember) => {
      if (err) reject(err);
      else resolve(newTeamMember);
    });
  });
}

export async function updateTeamMember(
  id: string,
  operation: UpdateOption,
  payload: any
): Promise<ITeamMember> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    var teamMember: ITeamMember;
    try {
      teamMember = await TeamMember.findById(id);
    } catch (e) {
      reject({ status: 404, message: e.message });
    }

    if (Array.isArray(payload)) {
      if (typeof payload[0] == "string") {
        switch (operation) {
          case "add permissions":
            teamMember.permissions.push(...payload);
            break;
          case "remove permissions":
            payload.forEach(perm => {
              teamMember.permissions.splice(
                teamMember.permissions.indexOf(perm)
              );
            });
            break;
          case "set permissions":
            teamMember.permissions = payload as [string];
            break;
        }
      } else {
        switch (operation) {
          case "add trials":
            teamMember.trials.push(...payload);
            break;
          case "add sites":
            teamMember.sites.push(...payload);
            break;
          case "add cccs":
            teamMember.cccs.push(...payload);
            break;
        }
      }
    } else if (typeof payload == "string") {
      switch (operation) {
        case "rename":
          teamMember.name = payload;
          break;
        case "update address":
          teamMember.address = payload;
          break;
        case "update description":
          teamMember.email = payload;
          break;
      }
    } else {
      if (operation == "update phoneNumber") teamMember.phone = payload;
    }

    teamMember.save((err: NativeError, updatedTeamMember: ITeamMember) => {
      if (err) reject({ status: 400, message: err.message });
      else resolve(updatedTeamMember);
    });
  });
}
