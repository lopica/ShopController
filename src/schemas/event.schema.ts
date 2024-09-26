import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, minlength: 5, maxlength: 100 })
  title: string;

  @Prop({ type: [String], default: [] })
  banner: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
