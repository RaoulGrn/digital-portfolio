import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Query,
  Request,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { ProjectService } from './project.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    const imageUrls = await this.cloudinaryService.uploadImages(files);
    createProjectDto.images = imageUrls;

    return this.projectService.create(createProjectDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req, @Query('showHidden') showHidden: string) {
    return this.projectService.findAll(req.user.userId, showHidden === 'true');
  }

  @Put(':id/toggle-visibility')
  toggleVisibility(@Request() req, @Param('id') id: string) {
    return this.projectService.toggleVisibility(id, req.user.userId);
  }
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.projectService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageUrls = await this.cloudinaryService.uploadImages(files);
    if (imageUrls.length > 0) {
      updateProjectDto.images = imageUrls;
    }

    return this.projectService.update(
      id,
      req.user.userId,
      updateProjectDto,
      files,
    );
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.projectService.remove(id, req.user.userId);
  }
}
