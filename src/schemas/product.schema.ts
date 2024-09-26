import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';
import { Event } from './event.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, minlength: 2, maxlength: 100 })
  name: string;

  @Prop({ required: true, minlength: 5, maxlength: 100 })
  title: string;

  @Prop({ required: true, minlength: 10, maxlength: 500 })
  description: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category_id: Types.ObjectId;

  @Prop({ default: 0, min: 0, max: 1 })
  discount: number; // Validation added for range

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number; // Rating should be between 0 and 5

  @Prop({ default: 0, min: 0 })
  stock: number; // Ensure stock cannot be negative

  @Prop({ default: false })
  status: boolean;

  @Prop({
    type: [String],
    validate: [arrayLimit, 'Exceeds the limit of 10 images'],
  })
  images: string[]; // Add validation for array length

  @Prop({ match: /https?:\/\/.+/ })
  thumbnail: string; // Consider validating URL format if required

  @Prop({ type: Types.ObjectId, ref: Event.name })
  event_id: Types.ObjectId;
}

// Custom validator to limit the number of images
function arrayLimit(val: string[]) {
  return val.length <= 10;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
