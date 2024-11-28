import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entity/comments.entity';
import { UserEntity } from 'src/entity/users.entity';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([CommentEntity, UserEntity]),
  ],
})
export class CommentsModule {}
