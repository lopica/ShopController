import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class OrderItem extends Document {
  @Prop()
  thumbnail: string;

  @Prop({ required: true })
  productTitle: string;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number; // Price per product
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
