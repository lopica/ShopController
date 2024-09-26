import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Account } from './accounts.schema';

export type ResponseDocument = HydratedDocument<Response>;

@Schema({ timestamps: true })
export class Response {
  @Prop({ type: Types.ObjectId, ref: Account.name, required: true })
  user_id: Types.ObjectId;  // Ensure user_id is required, linking the response to an account

  @Prop({ required: true, minlength: 3, maxlength: 500 })
  content: string;  // Changed 'test' to 'content' and added validation for length
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
