import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

export interface CloudinaryUploadResponse {
  secure_url: string; // URL to access the uploaded image
  // Add other relevant properties from Cloudinary's response if needed
}

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImageBuffer(buffer: Buffer, publicId: string): Promise<CloudinaryUploadResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId, // Set the public ID to the meaningful name
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error); // Log the error
            return reject(error);
          }
          resolve(result); // The result contains the URL
        },
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }
  
}