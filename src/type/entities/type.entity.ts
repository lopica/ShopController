import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TypeDocument = HydratedDocument<Type>;

@Schema({ timestamps: true })
export class Type {
  @Prop({ required: true })
  name: string;
}

export const TypeSchema = SchemaFactory.createForClass(Type);
