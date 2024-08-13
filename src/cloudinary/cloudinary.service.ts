import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private MAX_FILE_SIZE = 5 * 1024 * 1024;

  private ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  private validateFile(file: Express.Multer.File): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size should not exceed ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`,
      );
    }

    if (!this.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
      );
    }
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      this.validateFile(file);

      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'user_uploads',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          )
          .end(file.buffer);
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    try {
      const results = await Promise.all(uploadPromises);
      return results.map((result) => result.secure_url);
    } catch (error) {
      throw new BadRequestException('Failed to upload one or more images');
    }
  }
}
