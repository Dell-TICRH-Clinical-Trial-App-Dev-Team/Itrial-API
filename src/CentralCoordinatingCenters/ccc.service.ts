import {
  CentralCoordinatingCenter,
  ICentralCoordinatingCenter,
} from "./ccc.model";

export async function getCCCById(id: string): Promise<any> {
  return CentralCoordinatingCenter.findById(id);
}

export async function createCCC(newCCC: ICentralCoordinatingCenter) {
  const ccc = CentralCoordinatingCenter.build(newCCC);

  await ccc.save();
  return ccc;
}

export async function updateCCC(
  id: string,
  updatedCCC: ICentralCoordinatingCenter
) {
  return CentralCoordinatingCenter.findByIdAndUpdate(id, updatedCCC);
}
