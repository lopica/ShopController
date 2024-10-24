import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { TypeModule } from './type/type.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/HolaWear'), CategoryModule,  CloudinaryModule, TagModule, TypeModule, ProductModule, UserModule, RoleModule, BrandModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
