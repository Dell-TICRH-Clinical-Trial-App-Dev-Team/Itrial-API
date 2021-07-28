import { Trial, ITrial } from "./trials.model";

export async function getTrialById(id: String) {
  return Trial.findById(id);
}

export async function createTrial(newTrial: ITrial) {
  const trial = Trial.build(newTrial);

  await trial.save();
  return trial;
}

export async function updateTrial(id: String, updatedTrial: ITrial) {
  return Trial.findByIdAndUpdate(id, updatedTrial);
}
