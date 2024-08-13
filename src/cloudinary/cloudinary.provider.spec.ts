import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { v2 as cloudinary } from 'cloudinary';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
  },
}));

describe('CloudinaryProvider', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should configure cloudinary with correct values', () => {
    const mockCloudName = 'test-cloud';
    const mockApiKey = 'test-api-key';
    const mockApiSecret = 'test-api-secret';

    (configService.get as jest.Mock).mockImplementation((key: string) => {
      switch (key) {
        case 'CLOUDINARY_CLOUD_NAME':
          return mockCloudName;
        case 'CLOUDINARY_API_KEY':
          return mockApiKey;
        case 'CLOUDINARY_API_SECRET':
          return mockApiSecret;
        default:
          return undefined;
      }
    });

    CloudinaryProvider.useFactory(configService);

    expect(cloudinary.config).toHaveBeenCalledWith({
      cloud_name: mockCloudName,
      api_key: mockApiKey,
      api_secret: mockApiSecret,
    });
  });
});
