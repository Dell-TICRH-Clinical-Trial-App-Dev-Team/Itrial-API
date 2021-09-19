import { prop, Severity, modelOptions } from '@typegoose/typegoose';
import { ModelClass, CorrespondingEdge } from '../../utils/utils';
import { Intervention } from '../interventions/interventions.model';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
class EndpointInfo {
  // simple fields

  @prop({ required: true })
  type: 'quantitative' | 'qualitative' | 'file';

  @prop()
  range?: [string | number, string | number];

  @prop()
  url?: string;

  public static getSortPriorities(this: unknown): string[] {
    return 'ObjectId'.split(' ');
  }

  public static getSimpleFields(this: unknown): string[] {
    return 'type range url'.split(' ');
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
    return {};
  }
}

class TrialProtocol {
  // simple fields

  @prop({ required: true })
  name: string;

  // subdocument fields

  @prop()
  endpointInfo?: EndpointInfo;

  // subcollection fields

  @prop({ required: true, type: () => [Intervention] })
  interventions: Intervention[];

  public static getSortPriorities(this: unknown): string[] {
    return 'ObjectId'.split(' ');
  }

  public static getSimpleFields(this: unknown): string[] {
    return 'name'.split(' ');
  }

  public static getSubdocumentFieldMap(
    this: unknown
  ): Record<string, ModelClass> {
    return { endpointInfo: EndpointInfo };
  }

  public static getSingleEdgeFieldMap(
    this: unknown
  ): Record<string, CorrespondingEdge> {
    return {};
  }

  public static getSubcollectionFieldMap(
    this: unknown
  ): Record<string, ModelClass> {
    return {
      interventions: Intervention,
    };
  }

  public static getMultiEdgeFieldMap(
    this: unknown
  ): Record<string, CorrespondingEdge> {
    return {};
  }
}

export { EndpointInfo, TrialProtocol };
