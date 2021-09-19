import { prop, Ref } from '@typegoose/typegoose';
import { ModelClass, CorrespondingEdge } from '../../utils/utils';
import { Group } from '../../groups/groups.model';

class Intervention {
  // simple fields

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop()
  amount?: string;

  @prop({ required: true, type: () => [String] })
  timing: string[];

  // multi edge fields

  @prop({ required: true, ref: () => Group })
  groups: Ref<Group>[];

  public static getSortPriorities(this: unknown): string[] {
    return 'ObjectId'.split(' ');
  }

  public static getSimpleFields(this: unknown): string[] {
    return 'name description amount timing'.split(' ');
  }

  public static getSubdocumentFieldMap(
    this: unknown
  ): Record<string, ModelClass> {
    return {};
  }

  public static getSingleEdgeFieldMap(
    this: unknown
  ): Record<string, CorrespondingEdge> {
    return {};
  }

  public static getSubcollectionFieldMap(
    this: unknown
  ): Record<string, ModelClass> {
    return {};
  }

  public static getMultiEdgeFieldMap(
    this: unknown
  ): Record<string, CorrespondingEdge> {
    return {
      groups: { model: Group },
    };
  }
}

export { Intervention };
