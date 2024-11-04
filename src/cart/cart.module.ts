import { Module, forwardRef } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './entities/cart.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
