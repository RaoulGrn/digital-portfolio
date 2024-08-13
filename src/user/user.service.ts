import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { Project } from '../project/project.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<{ users: User[]; total: number; pages: number }> {
    const query = this.userModel.find().populate('projects');

    if (page && limit) {
      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);
    }

    const [users, total] = await Promise.all([
      query.exec(),
      this.userModel.countDocuments(),
    ]);

    const pages = limit ? Math.ceil(total / limit) : 1;

    return { users, total, pages };
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userModel
        .findById(id)
        .populate({
          path: 'projects',
          model: 'Project',
        })
        .exec();

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).populate('projects').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .populate('projects')
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async updateProfile(
    id: string,
    updateUserDto: UpdateUserDto,
    profilePicture?: Express.Multer.File,
  ): Promise<User> {
    let profilePictureUrl: string | undefined;

    if (profilePicture) {
      const uploadResult =
        await this.cloudinaryService.uploadImage(profilePicture);
      profilePictureUrl = uploadResult.secure_url;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...updateUserDto,
          ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
        },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.projectModel.deleteMany({ user: id });
    return deletedUser;
  }

  async findUserProjects(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ projects: Project[]; total: number; pages: number }> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const query = this.projectModel
      .find({ user: userId })
      .populate('user', 'username');

    if (page && limit) {
      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);
    }

    const [projects, total] = await Promise.all([
      query.exec(),
      this.projectModel.countDocuments({ user: userId }),
    ]);

    const pages = limit ? Math.ceil(total / limit) : 1;

    return { projects, total, pages };
  }

  // New search method
  async search(
    query: string,
    page?: number,
    limit?: number,
  ): Promise<{ users: User[]; total: number; pages: number }> {
    const userQuery = this.userModel
      .find({
        $or: [
          { username: new RegExp(query, 'i') },
          { 'projects.title': new RegExp(query, 'i') },
        ],
      })
      .populate('projects');

    if (page && limit) {
      const skip = (page - 1) * limit;
      userQuery.skip(skip).limit(limit);
    }

    const [users, total] = await Promise.all([
      userQuery.exec(),
      this.userModel.countDocuments({
        $or: [{ username: new RegExp(query, 'i') }],
      }),
    ]);

    const pages = limit ? Math.ceil(total / limit) : 1;

    return { users, total, pages };
  }
}
