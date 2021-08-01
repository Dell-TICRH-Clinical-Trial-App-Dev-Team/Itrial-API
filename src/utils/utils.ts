import { NativeError, ObjectId } from 'mongoose';

import { Endpoint } from '../endpoints/endpoints.model';
import { CentralCoordinatingCenter } from '../centralCoordinatingCenters/ccc.model';
import { Site } from '../sites/sites.model';
import { Patient } from '../patients/patients.model';
import { TeamMember } from '../teamMembers/teamMembers.model';
import { Group } from '../trials/groups/groups.model';

var modelMap: Map<string, any> = new Map();
modelMap.set('Central Coordinating Center', CentralCoordinatingCenter);
modelMap.set('CCC', CentralCoordinatingCenter);
modelMap.set('Endpoint', Endpoint);
modelMap.set('Patient', Patient);
modelMap.set('Site', Site);
modelMap.set('TeamMember', TeamMember);
modelMap.set('Trial', TeamMember);
modelMap.set('Group', Group);

export function isArrayOfStrings(arr: any): boolean {
  if (Array.isArray(arr))
    return (
      arr.filter(
        (item) => typeof item == 'string' || typeof item?.toString() == 'string'
      ).length > 0
    );

  return false;
}

export function doesDocumentWithIdExist(
  id: ObjectId | string,
  modelName: string
): boolean {
  modelMap
    .get(modelName)
    .countDocuments({ _id: id }, (err: NativeError, count: number) => {
      if (err) throw err;
      return count != 0;
    });

  return false;
}
