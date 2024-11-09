import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DepotProductDocument = DepotProduct & Document;

@Schema()
export class StockDetail {
  @Prop({ type: String, required: true })
  size: string;

  @Prop({ type: Number, default: 0 })
  quantity: number;
}

export const StockDetailSchema = SchemaFactory.createForClass(StockDetail);

@Schema()
export class Stock {
  @Prop({ type: String, required: true })
  colorCode: string;

  @Prop({ type: [StockDetailSchema] })
  details: StockDetail[];
}

export const StockSchema = SchemaFactory.createForClass(Stock);

@Schema({ collection: 'productdepots', timestamps: true })
export class DepotProduct {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, required: true })
  importPrice: number;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop({ type: [StockSchema] })
  stockDetails: Stock[];

  @Prop({ type: Number, required: true })
  importTotal: number;
}

export const DepotProductSchema = SchemaFactory.createForClass(DepotProduct);
