import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from './product.schema';
import { Account } from './accounts.schema';

export type OrderDocument = HydratedDocument<Order>;

class EmbeddedProduct {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product_id: Types.ObjectId;  // Ensure product_id is required

  @Prop({ required: true, min: 1, default: 1 })
  quantity: number;  // Ensure quantity is a positive integer, default is 1

  @Prop({ match: /https?:\/\/.+/, required: true })
  image: string;  // Ensure image is a valid URL and required

  @Prop({ min: 0, max: 1, default: 0 })
  discount: number;  // Ensure discount is a number between 0 and 1
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: [EmbeddedProduct], default: [] })
  products: EmbeddedProduct[];  // Default to an empty array

  @Prop({ default: 0 })
  totalCost: number;  // Default total cost to 0, to be calculated dynamically

  @Prop({ type: Types.ObjectId, ref: Account.name, required: true })
  account_id: Types.ObjectId;  // Ensure account_id is required
}

export const OrderSchema = SchemaFactory.createForClass(Order);
