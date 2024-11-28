import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'dto';
import { UserEntity } from 'src/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepo.create(dto);
    return await this.userRepo.save(user);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: string) {
    const data = await this.userRepo.findOneBy({ id });
    if (!data) {
      throw new NotFoundException(`user with id ${id} not found!`);
    }
    return data;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.preload({ id, ...dto });
    if (!user) {
      throw new NotFoundException(`Request with ID: ${id} not found`);
    }
    return this.userRepo.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }
}
