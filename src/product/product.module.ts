import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import {
  Category,
  CategorySchema,
} from 'src/category/entities/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { BrandModule } from 'src/brand/brand.module';
import { TagModule } from 'src/tag/tag.module';
import { TypeModule } from 'src/type/type.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoryModule,
    CloudinaryModule,
    BrandModule,
    TagModule,
    TypeModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
