import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

type MockUser = {
  _id: string;
  username: string;
  email: string;
  password: string;
  projects?: any[];
  profilePicture?: string;
  biography?: string;

  toObject: () => Omit<MockUser, 'toObject'>;
};

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const mockUser: MockUser = {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        projects: [],
        profilePicture: 'default.jpg',
        biography: 'Test bio',
        toObject: function () {
          const { toObject, ...rest } = this;
          return rest;
        },
      };

      userService.findOne.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('testuser', 'password');
      expect(result).toEqual({
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
        projects: [],
        profilePicture: 'default.jpg',
        biography: 'Test bio',
      });
    });
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const user = {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
      };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jwtService.sign.mockReturnValue('test-token');

      const result = await authService.login({
        username: 'testuser',
        password: 'password',
      });
      expect(result).toEqual({ access_token: 'test-token', id: '1' });
    });
  });

  describe('register', () => {
    it('should create a new user and return access token', async () => {
      userService.findOne.mockResolvedValue(null);
      const newUser = { _id: '1', username: 'newuser', email: 'new@user.com' };
      userService.create.mockResolvedValue(newUser as any);
      jwtService.sign.mockReturnValue('test-token');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await authService.register({
        username: 'newuser',
        email: 'new@user.com',
        password: 'password',
      });
      expect(result).toEqual({ access_token: 'test-token' });
      expect(userService.create).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@user.com',
        password: 'hashedPassword',
      });
    });
  });
});
