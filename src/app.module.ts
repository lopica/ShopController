import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/HolaWear'), CategoryModule,  CloudinaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
