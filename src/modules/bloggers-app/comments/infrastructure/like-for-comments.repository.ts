import { InjectModel } from '@nestjs/mongoose';
import {
  LikeForComment,
  type LikeForCommentModelType,
} from '../domain/like-for-comment.entity';
import type { LikeForCommentDocument } from '../domain/like-for-comment.entity';

class LikeForCommentsRepository {
  constructor(
    @InjectModel(LikeForComment.name)
    private readonly likeForCommentModel: LikeForCommentModelType,
  ) {}

  async save(likeForComment: LikeForCommentDocument) {
    return await likeForComment.save();
  }

  async findLikeForComment(
    commentId: string,
    userId: string,
  ): Promise<LikeForCommentDocument | null> {
    return await this.likeForCommentModel.findOne({
      commentId,
      userId,
      deletedAt: null,
    });
  }
}

export { LikeForCommentsRepository };
