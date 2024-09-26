import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Account } from './accounts.schema';
import { Response, ResponseSchema } from './response.schema';

export type ReportDocument = HydratedDocument<Report>;

// Enum for issue type
enum IssueType {
  BUG = 'Bug',
  FEEDBACK = 'Feedback',
  INQUIRY = 'Inquiry',
  OTHER = 'Other',
}

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: Types.ObjectId, ref: Account.name, required: true })
  account_id: Types.ObjectId;  // Report must be linked to an account

  @Prop({ enum: IssueType, required: true })
  issue_type: string;  // Restricted to predefined issue types

  @Prop({ required: true, minlength: 10 })
  description: string;  // Minimum length of description is 10 characters

  @Prop({ default: false })
  status: boolean;  // Default status is false (unresolved)

  @Prop({ type: Types.ObjectId, ref: Account.name, default: null })
  handler_id: Types.ObjectId;  // Handler ID is staff id 

  @Prop({ type: [ResponseSchema], default: [] })
  responses: Response[];  // Default to an empty array for responses
}

export const ReportSchema = SchemaFactory.createForClass(Report);
