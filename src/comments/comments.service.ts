import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto, UpdateCommentDto } from 'dto';
import { CommentEntity } from 'src/entity/comments.entity';
import { UserEntity } from 'src/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateCommentDto) {
    try {
      // Find the user to ensure it exists
      const user = await this.userRepo.findOneBy({
        id: dto.userId,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      let parent = null;

      // Fetch the parent if parentId is provided
      if (dto.parentId) {
        parent = await this.commentRepo.findOneBy({ id: dto.parentId });
      }

      // Prepare the comment
      const comment = this.commentRepo.create({
        text: dto.text,
        user,
        parent,
      });

      // Save and return the populated comment
      return await this.commentRepo.save(comment);
    } catch (error) {
      throw new BadRequestException('Failed to create comment', {
        cause: error,
        description: error.message,
      });
    }
  }

  async findAll() {
    return this.commentRepo.find({
      relations: ['user', 'parent'],
    });
  }
  async getTopLevelComments() {
    return this.commentRepo.find({
      where: { parent: null },
      relations: ['user', 'parent'],
      order: { createdAt: 'DESC' },
    });
  }
  async getCommentsByParentId(parentId: string) {
    try {
      return await this.commentRepo.find({
        where: { parent: { id: parentId } },
        relations: ['user', 'parent'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch child comments', {
        cause: error,
        description: error.message,
      });
    }
  }
  async findOne(id: string) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user', 'parent'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(id: string, dto: UpdateCommentDto) {
    const comment = await this.findOne(id);

    // Update fields
    if (dto.text) {
      comment.text = dto.text;
    }

    return this.commentRepo.save(comment);
  }

  async remove(id: string) {
    const comment = await this.findOne(id);
    await this.commentRepo.delete(comment);
  }
}
