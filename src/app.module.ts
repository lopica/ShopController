import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/HolaWear'), CategoryModule,  CloudinaryModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
