import {
  LikeForPost,
  type LikeForPostModelType,
} from '../domain/like-for-post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import type { LikeForPostDocument } from '../domain/like-for-post.entity';

@Injectable()
export class LikeForPostRepository {
  constructor(
    @InjectModel(LikeForPost.name)
    private LikeForPostModel: LikeForPostModelType,
  ) {}

  async save(likeForPost: LikeForPostDocument) {
    return await likeForPost.save();
  }

  async findLikeForPost(
    postId: string,
    userId: string,
  ): Promise<LikeForPostDocument | null> {
    return await this.LikeForPostModel.findOne({
      postId,
      userId,
      deletedAt: null,
    });
  }
}
