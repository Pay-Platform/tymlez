import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type PolicyPackageDocument = PolicyPackage & Document;

@Schema({ collection: 'policy_package' })
export class PolicyPackage {
  @Prop({ nullable: true })
  _id: Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.Mixed })
  policy: any;

  @Prop({ required: true, type: [SchemaTypes.Mixed] })
  schemas: any[];

  @Prop({ required: false })
  updatedDate?: Date;

  @Prop({ required: false })
  createdDate?: Date;
}

export const PolicyPackageSchema = SchemaFactory.createForClass(PolicyPackage);
