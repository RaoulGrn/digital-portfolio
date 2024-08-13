import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { Project } from '../project/project.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

describe('UserService', () => {
  let service: UserService;
  let userModel: jest.Mocked<Model<User>>;
  let projectModel: jest.Mocked<Model<Project>>;
  let cloudinaryService: jest.Mocked<CloudinaryService>;

  const mockUser = {
    _id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password',
    projects: [],
    save: jest.fn().mockResolvedValue(this),
    populate: jest.fn().mockReturnThis(),
  };

  const mockProject = {
    _id: 'project1',
    title: 'Test Project',
    description: 'Test Description',
    user: 'user1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            countDocuments: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(Project.name),
          useValue: {
            find: jest.fn(),
            deleteMany: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get(getModelToken(User.name));
    projectModel = module.get(getModelToken(Project.name));
    cloudinaryService = module.get(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpassword',
      };
      const newUser = { ...mockUser, ...createUserDto };
      userModel.create.mockResolvedValue(newUser as any);

      const result = await service.create(createUserDto);

      expect(result).toEqual(newUser);
      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return all users with pagination', async () => {
      const mockUsers = [mockUser];
      const mockCount = 1;
      userModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUsers),
      } as any);
      userModel.countDocuments.mockResolvedValue(mockCount);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        users: mockUsers,
        total: mockCount,
        pages: 1,
      });
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        _id: 'existingUserId',
        username: 'existingUser',
        email: 'existing@example.com',
        projects: [],
      };
      userModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await service.findById('existingUserId');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findById('nonexistentId')).rejects.toThrow(
        new NotFoundException('User with ID nonexistentId not found'),
      );
    });
  });

  describe('findOne', () => {
    it('should find a user by username', async () => {
      userModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await service.findOne('testuser');

      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser' };
      const updatedUser = { ...mockUser, ...updateUserDto };
      userModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as any);

      const result = await service.update('user1', updateUserDto);

      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.update('nonexistent', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile with new image', async () => {
      const updateUserDto: UpdateUserDto = { biography: 'New bio' };
      const profilePicture = {
        buffer: Buffer.from('test'),
      } as Express.Multer.File;
      const uploadResult: UploadApiResponse = {
        secure_url: 'http://example.com/image.jpg',
      } as UploadApiResponse;
      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
        profilePicture: uploadResult.secure_url,
      };

      cloudinaryService.uploadImage.mockResolvedValue(uploadResult);
      userModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as any);

      const result = await service.updateProfile(
        'user1',
        updateUserDto,
        profilePicture,
      );

      expect(result).toEqual(updatedUser);
      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(
        profilePicture,
      );
    });

    it('should update user profile without new image', async () => {
      const updateUserDto: UpdateUserDto = { biography: 'New bio' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      userModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as any);

      const result = await service.updateProfile('user1', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(cloudinaryService.uploadImage).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.updateProfile('nonexistent', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user and their projects', async () => {
      userModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);
      projectModel.deleteMany.mockResolvedValue({} as any);

      const result = await service.remove('user1');

      expect(result).toEqual(mockUser);
      expect(projectModel.deleteMany).toHaveBeenCalledWith({ user: 'user1' });
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findUserProjects', () => {
    it('should return user projects with pagination', async () => {
      const mockProjects = [mockProject];
      const mockCount = 1;
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);
      projectModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProjects),
      } as any);
      projectModel.countDocuments.mockResolvedValue(mockCount);

      const result = await service.findUserProjects('user1', 1, 10);

      expect(result).toEqual({
        projects: mockProjects,
        total: mockCount,
        pages: 1,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findUserProjects('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('search', () => {
    it('should search users with pagination', async () => {
      const mockUsers = [mockUser];
      const mockCount = 1;
      userModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUsers),
      } as any);
      userModel.countDocuments.mockResolvedValue(mockCount);

      const result = await service.search('test', 1, 10);

      expect(result).toEqual({
        users: mockUsers,
        total: mockCount,
        pages: 1,
      });
    });
  });
});
