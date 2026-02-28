import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../domain/comment.entity';

@Injectable()
class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async save(comment: Comment): Promise<void> {
    await this.commentRepo.save(comment);
  }

  async delete(commentId: string): Promise<void> {
    await this.commentRepo.softDelete(commentId);
  }

  async getCommentById(id: string): Promise<Comment | null> {
    const comment = await this.commentRepo.findOne({
      where: { id },
    });
    if (!comment) return null;
    return comment;
  }
}

export { CommentsRepository };
