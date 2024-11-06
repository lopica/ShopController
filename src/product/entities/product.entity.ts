import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

class StockDetail {
  @Prop({ required: true })
  size: string;

  @Prop({ required: true, default: 0 })
  quantity: number;
}

class Stock {
  @Prop({ required: true })
  colorCode: string;

  @Prop({ type: [StockDetail], required: true })
  details: StockDetail[];
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ required: true, default: 0 })
  discountPercentage: number;

  @Prop({ required: true, default: 0 })
  rating: number;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Type', required: true })
  type: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tag', required: true })
  tag: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand', required: true })
  brand: Types.ObjectId;

  @Prop({ required: true, enum: ['InActive', 'In Stock', 'Sold Out'], default: 'InActive' })
  availabilityStatus: string;

  @Prop({ type: [String], default: [] })
  reviews: string[];

  @Prop({ required: true, default: 1 })
  minimumOrderQuantity: number;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ type: [Stock], required: true })
  stockDetails: Stock[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
