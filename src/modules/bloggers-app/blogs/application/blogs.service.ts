import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { Blog } from '../domain/blog.entity';
import type { BlogDocument, BlogModelType } from '../domain/blog.entity';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import type { CreatePostForBlogDto } from '../../posts/dto/create-post.dto';
import { PostsServiceForBlog } from '../../posts/application/posts.service-for-blog';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private BlogsRepository: BlogsRepository,
    private PostsServiceForBlog: PostsServiceForBlog,
  ) {}
  async create(dto: CreateBlogDto) {
    const blog = this.BlogModel.create(dto);
    await this.BlogsRepository.save(blog);
    return blog._id.toString();
  }

  async update(id: string, dto: UpdateBlogDto): Promise<void> {
    const blog = await this.BlogsRepository.getBlogById(id);
    if (!blog) {
      throw new NotFoundException('Not Found');
    }
    blog.updateBlog(dto);
    await this.BlogsRepository.save(blog);
    return;
  }

  async remove(id: string): Promise<void> {
    const blog = await this.BlogsRepository.getBlogById(id);
    if (!blog) {
      throw new NotFoundException('Not Found');
    }
    blog.delete();
    await this.BlogsRepository.save(blog);
    return;
  }

  async getBlogById(id: string): Promise<BlogDocument | null> {
    return await this.BlogsRepository.getBlogById(id);
  }

  async createPostForBlog(
    blogId: string,
    dto: CreatePostForBlogDto,
  ): Promise<string> {
    const blog = await this.getBlogById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return await this.PostsServiceForBlog.create(
      {
        ...dto,
        blogId,
      },
      blog.name,
    );
  }
}
