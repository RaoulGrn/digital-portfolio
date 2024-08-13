import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { Project } from './project.schema';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const createdProject = new this.projectModel({
      ...createProjectDto,
      user: userId,
    });
    const savedProject = await createdProject.save();

    user.projects.push(savedProject.id);
    await user.save();

    return savedProject;
  }

  async findAll(
    userId: string,
    showHidden: boolean = false,
  ): Promise<Project[]> {
    const query: any = { user: userId };
    if (!showHidden) {
      query.isVisible = true;
    }
    return this.projectModel.find(query).exec();
  }

  async toggleVisibility(id: string, userId: string): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id, user: userId });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    project.isVisible = !project.isVisible;
    return project.save();
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectModel
      .findOne({ _id: id, user: userId })
      .exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }
  async update(
    id: string,
    userId: string,
    updateProjectDto: UpdateProjectDto,
    imageFiles?: Express.Multer.File[],
  ): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id, user: userId });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (imageFiles && imageFiles.length > 0) {
      const uploadResults =
        await this.cloudinaryService.uploadImages(imageFiles);
      if (!project.images) {
        project.images = [];
      }
      project.images.push(...uploadResults);
    }

    Object.assign(project, updateProjectDto);
    return project.save();
  }

  async remove(id: string, userId: string): Promise<Project> {
    const project = await this.projectModel
      .findOneAndDelete({ _id: id, user: userId })
      .exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Remove project reference from user
    await this.userModel.updateOne(
      { _id: userId },
      { $pull: { projects: id } },
    );

    return project;
  }
}
