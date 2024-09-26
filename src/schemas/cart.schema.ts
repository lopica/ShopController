import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Account } from './accounts.schema';
import { Product } from './product.schema';

export type CartDocument = HydratedDocument<Cart>;

class EmbeddedProduct {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product_id: Types.ObjectId; // Product ID is required

  @Prop({ required: true, min: 1, default: 1 })
  quantity: number; // Ensure quantity is a positive number, default is 1

  @Prop({ match: /https?:\/\/.+/, required: true }) // Ensure the image is a valid URL
  image: string;
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: Account.name, required: true })
  account_id: Types.ObjectId; // Account ID is required

  @Prop({
    type: [EmbeddedProduct],
    default: [],
    validate: {
      validator: function (products: EmbeddedProduct[]) {
        const productIds = products.map((p) => p.product_id.toString());
        return productIds.length === new Set(productIds).size; // Check for duplicates
      },
      message: 'Product should not be added more than once in the cart.',
    },
  })
  products: EmbeddedProduct[]; // Default to an empty array
}

export const CartSchema = SchemaFactory.createForClass(Cart);
