import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { TypeModule } from './type/type.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { BrandModule } from './brand/brand.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { DepotProductModule } from './depot-product/depot-product.module';
import { ColorModule } from './color/color.module';

@Module({
  imports: [MongooseModule.forRoot(`mongodb://localhost:27017/HolaWearV1`), CategoryModule,  CloudinaryModule, TagModule, TypeModule, ProductModule, UserModule, RoleModule, BrandModule, AuthModule, JwtModule.register({
    global: true,
    secret: 'sad',
    signOptions: { expiresIn: '120s' },
  }), CartModule, OrderModule, DepotProductModule, ColorModule],
  controllers: [AppController],
})
export class AppModule {}
