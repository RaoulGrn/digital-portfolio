import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    page = page ? parseInt(page.toString()) : undefined;
    limit = limit ? parseInt(limit.toString()) : undefined;
    return this.userService.findAll(page, limit);
  }

  // New search endpoint
  @UseGuards(JwtAuthGuard)
  @Get('search')
  search(
    @Query('query') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    page = page ? parseInt(page.toString()) : undefined;
    limit = limit ? parseInt(limit.toString()) : undefined;
    return this.userService.search(query, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/projects')
  findUserProjects(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    page = page ? parseInt(page.toString()) : undefined;
    limit = limit ? parseInt(limit.toString()) : undefined;
    return this.userService.findUserProjects(id, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/profile')
  @UseInterceptors(FileInterceptor('profilePicture'))
  updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    return this.userService.updateProfile(id, updateUserDto, profilePicture);
  }
}
