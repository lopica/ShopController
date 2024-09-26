import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 20 })
  username: string; // Username must be unique, with length validation

  @Prop({ required: true, minlength: 6, select: false })
  password: string; // Password is required, with a minimum length of 8 characters

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string; // Email must be unique and match a valid email format

  @Prop({
    required: true,
    enum: ['admin', 'customer', 'staff'],
    default: 'customer',
  })
  role: string; // Role limited to a set of allowed values

  @Prop({ default: false })
  status: boolean; // Account status, default is inactive (false)

  @Prop({ minlength: 2, maxlength: 50 })
  name: string; // Optional name field with validation for length

  @Prop({
    type: Date,
    validate: {
      validator: (value: Date) => value < new Date(),
      message: 'DOB must be in the past',
    },
  })
  dob: Date; // Date of birth, must be in the past

  @Prop({ enum: ['male', 'female', 'other'] })
  gender: string; // Gender restricted to predefined values

  @Prop({
    type: [String],
    validate: [arrayLimit, 'Location array exceeds the limit of 3'],
  })
  location: string[]; // Location array, limit to 3 locations

  @Prop({ match: /^[0-9]{10}$/, required: true })
  phone: string; // Phone number must match the required format (10 digits)
}

// Custom validator to limit the number of locations
function arrayLimit(val: string[]) {
  return val.length <= 3;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

// Hash password before saving it to the database
AccountSchema.pre('save', async function (next) {
  const account = this as AccountDocument;

  if (account.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(account.password, salt);
  }

  next();
});

