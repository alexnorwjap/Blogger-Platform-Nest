import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsRepository } from '../infrastructure/posts.repository';

@Injectable()
export class PostsServiceForBlog {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private PostsRepository: PostsRepository,
  ) {}

  async create(dto: CreatePostDto, blogName: string): Promise<string> {
    const post = this.PostModel.create(dto, blogName);
    await this.PostsRepository.save(post);
    return post._id.toString();
  }
}
