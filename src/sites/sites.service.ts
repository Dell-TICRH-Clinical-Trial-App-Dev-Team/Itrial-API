import { NativeError, ObjectId } from 'mongoose';
import { Site, ISite } from './sites.model';

const updateOptions = [
  'rename',
  'update address',
  'add trials',
  'add teamMembers',
  'add cccs',
];
export type UpdateOption = typeof updateOptions[number];

export async function getSiteById(id: string): Promise<ISite> {
  return new Promise((resolve, reject) => {
    Site.findById(id, (err: NativeError, site: ISite) => {
      if (err) reject({ status: 400, message: err.message });
      else if (!site)
        reject({
          status: 404,
          message: `Site with id: ${id} not found`,
        });
      else resolve(site);
    });
  });
}

export async function createSite(newSite: ISite): Promise<ISite> {
  return new Promise((resolve, reject) => {
    const site = Site.build(newSite);

    site.save((err: NativeError, newSite: ISite) => {
      if (err) reject(err);
      else resolve(newSite);
    });
  });
}

export async function updateSite(
  id: string,
  operation: UpdateOption,
  payload: string | [ObjectId]
): Promise<ISite> {
  return new Promise(async (resolve, reject) => {
    if (!updateOptions.includes(operation))
      reject({
        status: 400,
        message: `Invalid operation: ${operation}. List of valid operations ${updateOptions}`,
      });

    var site: ISite;
    try {
      site = await Site.findById(id);
    } catch (e) {
      reject({ status: 404, message: e.message });
    }

    if (Array.isArray(payload)) {
      switch (operation) {
        case 'add trials':
          site.trials.push(...payload);
          break;
        case 'add teamMembers':
          site.teamMembers.push(...payload);
          break;
        case 'add cccs':
          site.cccs.push(...payload);
          break;
      }
    } else {
      switch (operation) {
        case 'rename':
          site.name = payload;
          break;
        case 'update address':
          site.address = payload;
          break;
      }
    }

    site.save((err: NativeError, updatedSite: ISite) => {
      if (err) reject({ status: 400, message: err.message });
      else resolve(updatedSite);
    });
  });
}
