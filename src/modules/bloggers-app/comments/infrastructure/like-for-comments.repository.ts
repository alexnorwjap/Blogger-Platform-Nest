import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CommentLike } from '../domain/like-for-comment.entity';

@Injectable()
class LikeForCommentsRepository {
  constructor(
    @InjectRepository(CommentLike)
    private readonly commentLikeRepo: Repository<CommentLike>,
  ) {}

  async save(likeForComment: CommentLike): Promise<void> {
    await this.commentLikeRepo.save(likeForComment);
  }

  async delete(id: string): Promise<void> {
    await this.commentLikeRepo.softDelete(id);
  }

  async findLikeForComment(commentId: string, userId: string): Promise<CommentLike | null> {
    return await this.commentLikeRepo.findOne({
      where: {
        commentId,
        userId,
      },
      relations: ['user'],
    });
  }
}

export { LikeForCommentsRepository };
