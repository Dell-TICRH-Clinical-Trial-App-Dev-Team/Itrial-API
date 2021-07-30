import { NativeError } from "mongoose";
import { Trial, ITrial } from "./trials.model";
import { ITrialProtocol } from "./trialProtocols/trialProtocols.model";

const updateOptions = [
  "rename",
  "update endpointResults",
  "add protocols",
  "remove protocols",
  "set protocols",
  "add permissions",
  "remove permissions",
  "set permissions",
  "update blinded",
  "add sites",
  "add teamMembers",
  "add groups",
  "add patient",
  "remove sites",
  "remove teamMembers",
  "remove groups",
  "remove patient",
];
export type UpdateOption = typeof updateOptions[number];

export async function getTrialById(id: string): Promise<ITrial> {
  return new Promise((resolve, reject) => {
    Trial.findById(id, (err: NativeError, trial: ITrial) => {
      if (err) reject({ status: 400, message: err.message });
      else if (!trial)
        reject({
          status: 404,
          message: `Trial with id: ${id} not found`,
        });
      else resolve(trial);
    });
  });
}

export async function createTrial(newTrial: ITrial): Promise<ITrial> {
  return new Promise((resolve, reject) => {
    const trial = Trial.build(newTrial);

    trial.save((err: NativeError, newTrial: ITrial) => {
      if (err) reject(err);
      else resolve(newTrial);
    });
  });
}

export async function updateTrial(
  id: string,
  operation: UpdateOption,
  payload: any
): Promise<ITrial> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    var trial: ITrial;
    try {
      trial = await Trial.findById(id);
    } catch (e) {
      reject({ status: 404, message: e.message });
    }

    if (Array.isArray(payload)) {
      switch (operation) {
        case "add permissions":
          trial.permissions.push(...payload);
          break;
        case "remove permissions":
          payload.forEach(perm => {
            trial.permissions.splice(trial.permissions.indexOf(perm));
          });
          break;
        case "set permissions":
          trial.permissions = payload as [string];
          break;
        case "add sites":
          trial.sites.push(...payload);
          break;
        case "add teamMembers":
          trial.teamMembers.push(...payload);
          break;
        case "add groups":
          trial.groups.push(...payload);
          break;
        case "add patients":
          trial.patients.push(...payload);
          break;
        case "remove sites":
          payload.forEach(site => {
            trial.sites.splice(trial.sites.indexOf(site));
          });
          break;
        case "remove teamMembers":
          payload.forEach(teamMember => {
            trial.teamMembers.splice(trial.teamMembers.indexOf(teamMember));
          });
          break;
        case "remove groups":
          payload.forEach(group => {
            trial.groups.splice(trial.groups.indexOf(group));
          });
          break;
        case "remove patients":
          payload.forEach(patient => {
            trial.patients.splice(trial.patients.indexOf(patient));
          });
          break;
        case "add protocols":
          trial.protocols.push(...payload);
          break;
        case "remove protocols":
          trial.protocols.filter(protocol => payload.includes(protocol));
          break;
        case "set protocols":
          trial.protocols = payload as [ITrialProtocol];
      }
    } else if (typeof payload == "string") {
      switch (operation) {
        case "rename":
          trial.name = payload;
          break;
        case "update endpointResults":
          trial.endpointResults = payload;
          break;
      }
    } else {
      switch (operation) {
        case "update blinded":
          trial.blinded = payload;
          break;
      }
    }

    trial.save((err: NativeError, updatedTrial: ITrial) => {
      if (err) reject({ status: 400, message: err.message });
      else resolve(updatedTrial);
    });
  });
}
