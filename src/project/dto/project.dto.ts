import {
  IsString,
  IsArray,
  IsOptional,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  clientUrl: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  clientUrl?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}
