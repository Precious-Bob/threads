import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  name: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
