// address.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TypeDocument = HydratedDocument<ShippingAddress>;

@Schema()
export class ShippingAddress {
    _id?: Types.ObjectId;

    @Prop()
    fullName: string

    @Prop()
    phone: string

    @Prop()
    address: string

    @Prop()
    specificAddress: string
}

export const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);
