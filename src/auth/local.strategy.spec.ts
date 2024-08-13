import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get(AuthService);
  });

  describe('validate', () => {
    it('should return user object when credentials are valid', async () => {
      const user = { id: '1', username: 'testuser' };
      authService.validateUser.mockResolvedValue(user);

      const result = await localStrategy.validate('testuser', 'password');
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        localStrategy.validate('testuser', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
