import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Project } from './project.schema';
import { User } from '../user/user.schema';

type MockProject = Partial<Omit<Project, 'user'>> & {
  id: string;
  title: string;
  description: string;
  images?: string[];
  clientUrl?: string;
  isVisible?: boolean;
  user: Partial<User> | string;
};

describe('ProjectController', () => {
  let controller: ProjectController;
  let projectService: jest.Mocked<ProjectService>;
  let cloudinaryService: jest.Mocked<CloudinaryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            toggleVisibility: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadImages: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    projectService = module.get(ProjectService);
    cloudinaryService = module.get(CloudinaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProject', () => {
    it('should create a project', async () => {
      const createProjectDto: CreateProjectDto = {
        title: 'Test Project',
        description: 'Test Description',
        clientUrl: 'http://test.com',
      };
      const files = [{ filename: 'test.jpg' }] as Express.Multer.File[];
      const req = { user: { userId: 'user123' } };
      const imageUrls = ['http://cloudinary.com/test.jpg'];
      const createdProject: MockProject = {
        id: 'project123',
        ...createProjectDto,
        images: imageUrls,
        user: 'user123',
      };

      cloudinaryService.uploadImages.mockResolvedValue(imageUrls);
      projectService.create.mockResolvedValue(createdProject as any);

      const result = await controller.createProject(
        createProjectDto,
        files,
        req,
      );

      expect(cloudinaryService.uploadImages).toHaveBeenCalledWith(files);
      expect(projectService.create).toHaveBeenCalledWith(
        { ...createProjectDto, images: imageUrls },
        'user123',
      );
      expect(result).toEqual(createdProject);
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const req = { user: { userId: 'user123' } };
      const projects: MockProject[] = [
        {
          id: 'project1',
          title: 'Project 1',
          description: 'Desc 1',
          user: 'user123',
        },
        {
          id: 'project2',
          title: 'Project 2',
          description: 'Desc 2',
          user: 'user123',
        },
      ];
      projectService.findAll.mockResolvedValue(projects as any);

      const result = await controller.findAll(req, 'false');

      expect(projectService.findAll).toHaveBeenCalledWith('user123', false);
      expect(result).toEqual(projects);
    });
  });

  describe('toggleVisibility', () => {
    it('should toggle project visibility', async () => {
      const req = { user: { userId: 'user123' } };
      const projectId = 'project123';
      const updatedProject: MockProject = {
        id: projectId,
        isVisible: true,
        title: 'Test',
        description: 'Desc',
        user: 'user123',
      };
      projectService.toggleVisibility.mockResolvedValue(updatedProject as any);

      const result = await controller.toggleVisibility(req, projectId);

      expect(projectService.toggleVisibility).toHaveBeenCalledWith(
        projectId,
        'user123',
      );
      expect(result).toEqual(updatedProject);
    });
  });

  describe('findOne', () => {
    it('should return a single project', async () => {
      const req = { user: { userId: 'user123' } };
      const projectId = 'project123';
      const project: MockProject = {
        id: projectId,
        title: 'Test Project',
        description: 'Test Desc',
        user: 'user123',
      };
      projectService.findOne.mockResolvedValue(project as any);

      const result = await controller.findOne(req, projectId);

      expect(projectService.findOne).toHaveBeenCalledWith(projectId, 'user123');
      expect(result).toEqual(project);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const req = { user: { userId: 'user123' } };
      const projectId = 'project123';
      const updateProjectDto: UpdateProjectDto = { title: 'Updated Title' };
      const files = [{ filename: 'new.jpg' }] as Express.Multer.File[];
      const imageUrls = ['http://cloudinary.com/new.jpg'];
      const updatedProject: MockProject = {
        id: projectId,
        title: 'Updated Title',
        description: 'Original Desc',
        images: imageUrls,
        user: 'user123',
      };

      cloudinaryService.uploadImages.mockResolvedValue(imageUrls);
      projectService.update.mockResolvedValue(updatedProject as any);

      const result = await controller.update(
        req,
        projectId,
        updateProjectDto,
        files,
      );

      expect(cloudinaryService.uploadImages).toHaveBeenCalledWith(files);
      expect(projectService.update).toHaveBeenCalledWith(
        projectId,
        'user123',
        { ...updateProjectDto, images: imageUrls },
        files,
      );
      expect(result).toEqual(updatedProject);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      const req = { user: { userId: 'user123' } };
      const projectId = 'project123';
      const removedProject: MockProject = {
        id: projectId,
        title: 'Removed Project',
        description: 'Removed Desc',
        user: 'user123',
      };
      projectService.remove.mockResolvedValue(removedProject as any);

      const result = await controller.remove(req, projectId);

      expect(projectService.remove).toHaveBeenCalledWith(projectId, 'user123');
      expect(result).toEqual(removedProject);
    });
  });
});
