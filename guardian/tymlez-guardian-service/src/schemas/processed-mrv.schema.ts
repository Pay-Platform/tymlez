import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type ProcessedMrvDocument = ProcessedMrv & Document;

@Schema({ collection: 'processed_mrv' })
export class ProcessedMrv {
  @Prop({ required: false, type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  timestamp: string;

  @Prop({ required: true })
  policyTag: string;

  @Prop({ required: false })
  createdDate: Date;

  @Prop({ required: false })
  updatedDate: Date;
}

export const ProcessedMrvSchema = SchemaFactory.createForClass(ProcessedMrv);
