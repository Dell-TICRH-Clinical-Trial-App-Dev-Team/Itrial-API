import { prop } from '@typegoose/typegoose';

class DocumentFile {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  link: string;
}

export { DocumentFile };
