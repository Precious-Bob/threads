import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
