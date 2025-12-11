import { Post } from '../domain/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { PostModelType } from '../domain/post.entity';
import { PostsRepository } from '../infrastructure/posts.repository';
import { UpdatePostDto } from '../dto/update-post.dto';
import { BlogsService } from '../../blogs/application/blogs.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private PostsRepository: PostsRepository,
    private BlogsService: BlogsService,
  ) {}
  async create(dto: CreatePostDto) {
    const blog = await this.BlogsService.getBlogById(dto.blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    const post = this.PostModel.create(dto, blog.name);
    await this.PostsRepository.save(post);
    return post._id.toString();
  }

  async update(id: string, dto: UpdatePostDto) {
    const post = await this.PostsRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.update(dto);
    await this.PostsRepository.save(post);
    return post._id.toString();
  }

  async delete(id: string): Promise<void> {
    const post = await this.PostsRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.delete();
    await this.PostsRepository.save(post);
    return;
  }
}
