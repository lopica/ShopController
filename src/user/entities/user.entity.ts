import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ShippingAddress } from './shipping-address.entity';
import { Role } from 'src/role/entities/role.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  role: Role;

  @Prop()
  gender: string;

  @Prop()
  phone: string;

  @Prop({ type: [ShippingAddress], default: [] })
  shippingAddress: ShippingAddress[];

  @Prop({ required: true, default: true })
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
