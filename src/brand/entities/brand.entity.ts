import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: true})
  status: boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
