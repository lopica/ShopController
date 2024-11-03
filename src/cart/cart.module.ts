import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './entities/cart.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]), UserModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
