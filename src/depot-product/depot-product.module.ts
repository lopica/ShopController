import { Module } from '@nestjs/common';
import { DepotProductService } from './depot-product.service';
import { DepotProductController } from './depot-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DepotProduct, DepotProductSchema } from './entities/depot-product.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: DepotProduct.name, schema: DepotProductSchema }]), ProductModule],
  controllers: [DepotProductController],
  providers: [DepotProductService],
})
export class DepotProductModule {}
