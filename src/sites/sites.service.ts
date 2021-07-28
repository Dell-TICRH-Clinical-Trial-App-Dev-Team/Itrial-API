import { Site, ISite } from "./sites.model";

export async function getSiteById(id: String) {
  return Site.findById(id);
}

export async function createSite(newSite: ISite) {
  const site = Site.build(newSite);

  await site.save();
  return site;
}

export async function updateSite(id: String, updatedSite: ISite) {
  return Site.findByIdAndUpdate(id, updatedSite);
}
