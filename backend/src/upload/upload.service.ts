import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      try {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio_avatars' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } catch (err) {
        reject(err);
      }
    });
  }

  uploadPdf(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      try {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'portfolio_cv',
            resource_type: 'image',
            format: 'pdf',
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } catch (err) {
        reject(err);
      }
    });
  }
}
