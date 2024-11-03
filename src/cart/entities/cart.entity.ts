import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
export class CartItem {
  @Prop({ required: true })
  productTitle: string;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number; // Price per product
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// Define CartDocument type as HydratedDocument<Cart>
export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [CartItemSchema], required: true })
  cartItems: CartItem[];

  @Prop({ required: true })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
