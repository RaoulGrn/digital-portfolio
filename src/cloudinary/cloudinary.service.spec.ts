import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const mockResult: UploadApiResponse = {
        public_id: 'test_public_id',
        version: 1234567890,
        signature: 'test_signature',
        width: 100,
        height: 100,
        format: 'jpg',
        resource_type: 'image',
        created_at: '2023-01-01T00:00:00Z',
        tags: [],
        bytes: 1024,
        type: 'upload',
        etag: 'test_etag',
        url: 'http://test-url.com/image.jpg',
        secure_url: 'https://test-url.com/image.jpg',
        original_filename: 'test',
        api_key: 'test_api_key',
        asset_id: 'test_asset_id',
        pages: 1,
        placeholder: false,
        access_mode: 'public',
        moderation: [],
        folders: [],
        duration: null,
        audio: null,
        video: null,
        context: {},
        access_control: null,
        overwritten: false,
        colors: null,
        predominant: null,
        color: null,
        exif: null,
        image_metadata: null,
        faces: null,
        quality_analysis: null,
        quality_score: null,
        phash: null,
        metadata: undefined,
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, mockResult);
          return { end: jest.fn() };
        },
      );

      const result = await service.uploadImage(mockFile);

      expect(result).toEqual(mockResult);
    });

    it('should throw BadRequestException on upload failure', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const mockError: UploadApiErrorResponse = {
        message: 'Upload failed',
        name: 'Error',
        http_code: 400,
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          process.nextTick(() => callback(mockError, null));
          return {
            end: jest.fn().mockImplementation(() => {
              throw new Error('Upload failed');
            }),
          };
        },
      );

      await expect(service.uploadImage(mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('uploadImages', () => {
    it('should upload multiple images successfully', async () => {
      const mockFiles = [
        { buffer: Buffer.from('test1'), mimetype: 'image/jpeg', size: 1024 },
        { buffer: Buffer.from('test2'), mimetype: 'image/png', size: 1024 },
      ] as Express.Multer.File[];

      const mockResults: UploadApiResponse[] = [
        {
          public_id: 'test_public_id_1',
          version: 1234567890,
          signature: 'test_signature_1',
          width: 100,
          height: 100,
          format: 'jpg',
          resource_type: 'image',
          created_at: '2023-01-01T00:00:00Z',
          tags: [],
          bytes: 1024,
          type: 'upload',
          etag: 'test_etag_1',
          url: 'http://test-url.com/image1.jpg',
          secure_url: 'https://test-url.com/image1.jpg',
          original_filename: 'test1',
          pages: 0,
          placeholder: false,
          access_mode: '',
          moderation: [],
          access_control: [],
          context: undefined,
          metadata: undefined,
        },
        {
          public_id: 'test_public_id_2',
          version: 1234567891,
          signature: 'test_signature_2',
          width: 200,
          height: 200,
          format: 'png',
          resource_type: 'image',
          created_at: '2023-01-01T00:00:01Z',
          tags: [],
          bytes: 2048,
          type: 'upload',
          etag: 'test_etag_2',
          url: 'http://test-url.com/image2.png',
          secure_url: 'https://test-url.com/image2.png',
          original_filename: 'test2',
          pages: 0,
          placeholder: false,
          access_mode: '',
          moderation: [],
          access_control: [],
          context: undefined,
          metadata: undefined,
        },
      ];

      jest
        .spyOn(service, 'uploadImage')
        .mockImplementation((file) =>
          Promise.resolve(mockResults[mockFiles.indexOf(file as any)]),
        );

      const results = await service.uploadImages(mockFiles);

      expect(results).toEqual(mockResults.map((r) => r.secure_url));
    });

    it('should throw BadRequestException if any upload fails', async () => {
      const mockFiles = [
        { buffer: Buffer.from('test1'), mimetype: 'image/jpeg', size: 1024 },
        { buffer: Buffer.from('test2'), mimetype: 'image/png', size: 1024 },
      ] as Express.Multer.File[];

      jest
        .spyOn(service, 'uploadImage')
        .mockImplementation(() =>
          Promise.reject(new BadRequestException('Upload failed')),
        );

      await expect(service.uploadImages(mockFiles)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
