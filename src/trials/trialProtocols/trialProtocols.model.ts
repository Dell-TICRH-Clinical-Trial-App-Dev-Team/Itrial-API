import { prop, modelOptions, Severity } from '@typegoose/typegoose';
import { Intervention } from '../interventions/interventions.model';

/* needs some work */
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
class EndpointInfo {
  @prop({ required: true })
  type: 'quantitative' | 'qualitative' | 'file';

  @prop()
  range?: [string | number, string | number];

  @prop()
  url?: string;
}

class TrialProtocol {
  @prop({ required: true })
  name: string;

  @prop({ required: true, type: () => [Intervention] })
  interventions: Intervention[];

  @prop()
  endpointInfo?: EndpointInfo;
}

export { EndpointInfo, TrialProtocol };
