import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { ShippingAddress, ShippingAddressSchema } from './shipping-address.entity';
import { OrderItem, OrderItemSchema } from './order-item.entity';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItemSchema] })
  orderItems: OrderItem[];

  @Prop({ type: ShippingAddressSchema })
  shippingAddress: ShippingAddress;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ 
    type: String,
    enum: ['pending', 'completed', 'shipping', 'cancelled'],
    default: 'pending'
  })
  orderStatus: string;

  @Prop({ default: false })
  isPayment: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
