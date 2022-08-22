import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type DeviceConfigDocument = DeviceConfig & Document;

@Schema({ collection: 'device_config' })
export class DeviceConfig {
  @Prop({ required: false })
  title: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  deviceType: string;

  @Prop({ required: true })
  policyTag: string;

  @Prop({ required: true, type: SchemaTypes.Mixed })
  config: any;

  @Prop({ required: false })
  createdDate: Date;

  @Prop({ required: false })
  updatedDate: Date;
}

export const DeviceConfigSchema = SchemaFactory.createForClass(DeviceConfig);
