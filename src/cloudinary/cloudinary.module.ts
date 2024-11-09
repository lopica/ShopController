import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, CloudinaryService], // Include CloudinaryService here
  exports: [CloudinaryProvider, CloudinaryService], // Now it can be exported without issue
})
export class CloudinaryModule {}
