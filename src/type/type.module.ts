import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { TypeSchema } from './entities/type.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Type.name, schema: TypeSchema }])],
  controllers: [TypeController],
  providers: [TypeService],
  exports: [TypeService]
})
export class TypeModule {}
