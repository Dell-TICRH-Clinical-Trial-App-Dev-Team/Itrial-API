import { NativeError, ObjectId } from "mongoose";
import { Endpoint, IEndpoint } from "./endpoints.model";

const updateOptions = [
  "rename",
  "change date",
  "update description",
  "update score",
  "add documents",
  "change site",
  "change trial",
  "change group",
  "change patient",
];
export type UpdateOption = typeof updateOptions[number];

export async function getEndpointById(id: string): Promise<IEndpoint> {
  return new Promise((resolve, reject) => {
    Endpoint.findById(id, (err: NativeError, endpoint: IEndpoint) => {
      if (err) reject({ status: 400, message: err.message });
      else if (!endpoint)
        reject({
          status: 404,
          message: `Endpoint with id: ${id} not found`,
        });
      else resolve(endpoint);
    });
  });
}

export async function createEndpoint(
  newEndpoint: IEndpoint
): Promise<IEndpoint> {
  return new Promise((resolve, reject) => {
    const endpoint = Endpoint.build(newEndpoint);

    endpoint.save((err: NativeError, newEndpoint: IEndpoint) => {
      if (err) reject(err);
      else resolve(newEndpoint);
    });
  });
}

export async function updateEndpoint(
  id: string,
  operation: UpdateOption,
  payload: string | [String] | ObjectId
): Promise<IEndpoint> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    var endpoint: IEndpoint;
    try {
      endpoint = await Endpoint.findById(id);
    } catch (e) {
      reject({ status: 404, message: e.message });
    }

    if (Array.isArray(payload)) {
      if (operation == "add documents") endpoint.documents.push(...payload);
    } else if (typeof payload == "string") {
      switch (operation) {
        case "rename":
          endpoint.name = payload;
          break;
        case "change date":
          endpoint.date = new Date(payload);
          break;
        case "update description":
          endpoint.description = payload;
          break;
        case "update score":
          endpoint.score = payload;
          break;
      }
    } else {
      switch (operation) {
        case "change site":
          endpoint.site = payload;
          break;
        case "change trial":
          endpoint.trial = payload;
          break;
        case "change group":
          endpoint.group = payload;
          break;
        case "change trial":
          endpoint.patient = payload;
          break;
      }
    }

    endpoint.save((err: NativeError, updatedEndpoint: IEndpoint) => {
      if (err) reject({ status: 400, message: err.message });
      else resolve(updatedEndpoint);
    });
  });
}
