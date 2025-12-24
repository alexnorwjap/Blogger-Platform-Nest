import { InjectModel } from '@nestjs/mongoose';
import type {
  CommentDocument,
  CommentModelType,
} from '../domain/comments.entity';
import { Comment } from '../domain/comments.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: CommentModelType,
  ) {}

  async save(comment: CommentDocument) {
    return await comment.save();
  }
  async getCommentById(id: string): Promise<CommentDocument | null> {
    return await this.commentModel.findOne({ _id: id, deletedAt: null });
  }
}

export { CommentsRepository };
