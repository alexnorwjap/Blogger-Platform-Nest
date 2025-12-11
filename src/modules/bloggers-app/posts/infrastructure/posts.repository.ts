import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';
import type { PostDocument } from '../domain/post.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async save(post: PostDocument) {
    return await post.save();
  }
  async getPostById(id: string): Promise<PostDocument | null> {
    return await this.PostModel.findOne({ _id: id, deletedAt: null });
  }
}
