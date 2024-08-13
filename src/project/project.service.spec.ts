import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './project.schema';
import { User } from '../user/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

describe('ProjectService', () => {
  let service: ProjectService;
  let projectModel: Model<Project>;
  let userModel: Model<User>;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const projectModelMock = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndDelete: jest.fn(),
      exec: jest.fn(),
    };

    const userModelMock = {
      findById: jest.fn(),
      updateOne: jest.fn(),
    };

    const cloudinaryServiceMock = {
      uploadImages: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getModelToken(Project.name),
          useValue: projectModelMock,
        },
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
        },
        {
          provide: CloudinaryService,
          useValue: cloudinaryServiceMock,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    projectModel = module.get<Model<Project>>(getModelToken(Project.name));
    userModel = module.get<Model<User>>(getModelToken(User.name));
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const createProjectDto: CreateProjectDto = {
        title: 'Test Project',
        description: 'Test Description',
        clientUrl: '',
      };
      const userId = 'user123';
      const user = { _id: userId, projects: [], save: jest.fn() };
      const savedProject = {
        ...createProjectDto,
        _id: 'project123',
        user: userId,
        save: jest.fn().mockResolvedValue({
          ...createProjectDto,
          _id: 'project123',
          user: userId,
        }),
      };

      jest.spyOn(userModel, 'findById').mockResolvedValue(user as any);
      jest.spyOn(projectModel, 'create').mockResolvedValue(savedProject as any);

      const result = await service.create(createProjectDto, userId);

      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(projectModel.create).toHaveBeenCalledWith({
        ...createProjectDto,
        user: userId,
      });
      expect(savedProject.save).toHaveBeenCalled();
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          _id: 'project123',
          title: 'Test Project',
          description: 'Test Description',
          user: userId,
        }),
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userModel, 'findById').mockResolvedValue(null);

      await expect(
        service.create({} as CreateProjectDto, 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all visible projects for a user', async () => {
      const userId = 'user123';
      const projects = [{ title: 'Project 1' }, { title: 'Project 2' }];
      jest.spyOn(projectModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(projects),
      } as any);

      const result = await service.findAll(userId);

      expect(projectModel.find).toHaveBeenCalledWith({
        user: userId,
        isVisible: true,
      });
      expect(result).toEqual(projects);
    });

    it('should return all projects for a user when showHidden is true', async () => {
      const userId = 'user123';
      const projects = [{ title: 'Project 1' }, { title: 'Project 2' }];
      jest.spyOn(projectModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(projects),
      } as any);

      const result = await service.findAll(userId, true);

      expect(projectModel.find).toHaveBeenCalledWith({ user: userId });
      expect(result).toEqual(projects);
    });
  });

  describe('toggleVisibility', () => {
    it('should toggle project visibility', async () => {
      const projectId = 'project123';
      const userId = 'user123';
      const project = { _id: projectId, isVisible: true, save: jest.fn() };
      jest.spyOn(projectModel, 'findOne').mockResolvedValue(project as any);
      project.save.mockResolvedValue({ ...project, isVisible: false });

      const result = await service.toggleVisibility(projectId, userId);

      expect(projectModel.findOne).toHaveBeenCalledWith({
        _id: projectId,
        user: userId,
      });
      expect(project.save).toHaveBeenCalled();
      expect(result.isVisible).toBe(false);
    });

    it('should throw NotFoundException if project not found', async () => {
      jest.spyOn(projectModel, 'findOne').mockResolvedValue(null);

      await expect(
        service.toggleVisibility('nonexistent', 'user123'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a single project', async () => {
      const projectId = 'project123';
      const userId = 'user123';
      const project = { _id: projectId, title: 'Test Project' };
      jest.spyOn(projectModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(project),
      } as any);

      const result = await service.findOne(projectId, userId);

      expect(projectModel.findOne).toHaveBeenCalledWith({
        _id: projectId,
        user: userId,
      });
      expect(result).toEqual(project);
    });

    it('should throw NotFoundException if project not found', async () => {
      jest.spyOn(projectModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('nonexistent', 'user123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const projectId = 'project123';
      const userId = 'user123';
      const updateProjectDto: UpdateProjectDto = { title: 'Updated Title' };
      const project = { _id: projectId, ...updateProjectDto, save: jest.fn() };
      jest.spyOn(projectModel, 'findOne').mockResolvedValue(project as any);
      project.save.mockResolvedValue(project);

      const result = await service.update(projectId, userId, updateProjectDto);

      expect(projectModel.findOne).toHaveBeenCalledWith({
        _id: projectId,
        user: userId,
      });
      expect(project.save).toHaveBeenCalled();
      expect(result).toEqual(project);
    });

    it('should update a project with new images', async () => {
      const projectId = 'project123';
      const userId = 'user123';
      const updateProjectDto: UpdateProjectDto = { title: 'Updated Title' };
      const imageFiles = [{ filename: 'new.jpg' }] as Express.Multer.File[];
      const uploadResults = ['http://cloudinary.com/new.jpg'];
      const project = {
        _id: projectId,
        ...updateProjectDto,
        images: [],
        save: jest.fn(),
      };

      jest.spyOn(projectModel, 'findOne').mockResolvedValue(project as any);
      jest
        .spyOn(cloudinaryService, 'uploadImages')
        .mockResolvedValue(uploadResults);
      project.save.mockResolvedValue({ ...project, images: uploadResults });

      const result = await service.update(
        projectId,
        userId,
        updateProjectDto,
        imageFiles,
      );

      expect(projectModel.findOne).toHaveBeenCalledWith({
        _id: projectId,
        user: userId,
      });
      expect(cloudinaryService.uploadImages).toHaveBeenCalledWith(imageFiles);
      expect(project.save).toHaveBeenCalled();
      expect(result.images).toEqual(uploadResults);
    });

    it('should throw NotFoundException if project not found', async () => {
      jest.spyOn(projectModel, 'findOne').mockResolvedValue(null);

      await expect(
        service.update('nonexistent', 'user123', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      const projectId = 'project123';
      const userId = 'user123';
      const project = { _id: projectId, title: 'Test Project' };
      jest.spyOn(projectModel, 'findOneAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(project),
      } as any);
      jest.spyOn(userModel, 'updateOne').mockResolvedValue({} as any);

      const result = await service.remove(projectId, userId);

      expect(projectModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: projectId,
        user: userId,
      });
      expect(userModel.updateOne).toHaveBeenCalledWith(
        { _id: userId },
        { $pull: { projects: projectId } },
      );
      expect(result).toEqual(project);
    });

    it('should throw NotFoundException if project not found', async () => {
      jest.spyOn(projectModel, 'findOneAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.remove('nonexistent', 'user123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
