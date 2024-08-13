import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

type MockUser = {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  biography?: string;
  domain?: string;
  city?: string;
  country?: string;
  projects?: string[];
};

type MockProject = {
  id: string;
  title: string;
  description?: string;
};

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            search: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findUserProjects: jest.fn(),
            updateProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };
      const createdUser: MockUser = { id: '1', ...createUserDto, projects: [] };
      userService.create.mockResolvedValue(createdUser as any);

      expect(await controller.create(createUserDto)).toBe(createdUser);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers: MockUser[] = [
        {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          password: 'password1',
        },
        {
          id: '2',
          username: 'user2',
          email: 'user2@example.com',
          password: 'password2',
        },
      ];
      const result = { users: mockUsers, total: 2, pages: 1 };
      userService.findAll.mockResolvedValue(result as any);

      expect(await controller.findAll()).toBe(result);
      expect(userService.findAll).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should use pagination when provided', async () => {
      const page = 1;
      const limit = 10;
      await controller.findAll(page, limit);

      expect(userService.findAll).toHaveBeenCalledWith(page, limit);
    });
  });

  describe('search', () => {
    it('should search users', async () => {
      const query = 'test';
      const mockUsers: MockUser[] = [
        {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
        },
      ];
      const result = { users: mockUsers, total: 1, pages: 1 };
      userService.search.mockResolvedValue(result as any);

      expect(await controller.search(query)).toBe(result);
      expect(userService.search).toHaveBeenCalledWith(
        query,
        undefined,
        undefined,
      );
    });

    it('should use pagination when provided', async () => {
      const query = 'test';
      const page = 1;
      const limit = 10;
      await controller.search(query, page, limit);

      expect(userService.search).toHaveBeenCalledWith(query, page, limit);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const userId = '1';
      const user: MockUser = {
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };
      userService.findById.mockResolvedValue(user as any);

      expect(await controller.findOne(userId)).toBe(user);
      expect(userService.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { username: 'updateduser' };
      const updatedUser: MockUser = {
        id: userId,
        username: 'updateduser',
        email: 'test@example.com',
        password: 'password',
      };
      userService.update.mockResolvedValue(updatedUser as any);

      expect(await controller.update(userId, updateUserDto)).toBe(updatedUser);
      expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';
      const result: MockUser = {
        id: userId,
        username: 'deleteduser',
        email: 'deleted@example.com',
        password: 'password',
      };
      userService.remove.mockResolvedValue(result as any);

      expect(await controller.remove(userId)).toBe(result);
      expect(userService.remove).toHaveBeenCalledWith(userId);
    });
  });

  describe('findUserProjects', () => {
    it('should return user projects', async () => {
      const userId = '1';
      const mockProjects: MockProject[] = [
        { id: '1', title: 'Project 1' },
        { id: '2', title: 'Project 2' },
      ];
      const result = { projects: mockProjects, total: 2, pages: 1 };
      userService.findUserProjects.mockResolvedValue(result as any);

      expect(await controller.findUserProjects(userId)).toBe(result);
      expect(userService.findUserProjects).toHaveBeenCalledWith(
        userId,
        undefined,
        undefined,
      );
    });

    it('should use pagination when provided', async () => {
      const userId = '1';
      const page = 1;
      const limit = 10;
      await controller.findUserProjects(userId, page, limit);

      expect(userService.findUserProjects).toHaveBeenCalledWith(
        userId,
        page,
        limit,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { biography: 'New bio' };
      const profilePicture = { filename: 'profile.jpg' } as Express.Multer.File;
      const updatedUser: MockUser = {
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        biography: 'New bio',
        profilePicture: 'profile.jpg',
      };
      userService.updateProfile.mockResolvedValue(updatedUser as any);

      expect(
        await controller.updateProfile(userId, updateUserDto, profilePicture),
      ).toBe(updatedUser);
      expect(userService.updateProfile).toHaveBeenCalledWith(
        userId,
        updateUserDto,
        profilePicture,
      );
    });
  });
});
