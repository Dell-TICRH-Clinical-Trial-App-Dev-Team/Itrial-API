import { prop, Ref } from '@typegoose/typegoose';
import { Group } from '../groups/groups.model';

class Intervention {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop({ required: false })
  amount?: string;

  @prop({ required: true, type: () => [String] })
  timing: string[];

  @prop({ required: true, ref: () => Group })
  groups: Ref<Group>[];
}

export { Intervention };
