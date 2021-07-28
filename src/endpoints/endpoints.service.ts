import { Endpoint, IEndpoint } from "./endpoints.model";

export async function getEndpointById(id: string): Promise<any> {
  Endpoint.findById(id);
}

export async function createEndpoint(newEndpoint: IEndpoint) {
  const endpoint = Endpoint.build(newEndpoint);

  await endpoint.save();
  return endpoint;
}

export async function updateEndpoint(id: string, updatedEndpoint: IEndpoint) {
  return Endpoint.findByIdAndUpdate(id, updatedEndpoint);
}
