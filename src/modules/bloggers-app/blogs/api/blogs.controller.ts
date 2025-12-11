import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { NotFoundException } from '@nestjs/common';
import { BlogsQueryParams } from './input-dto/blogs.query-params';
import { PostsQueryParams } from '../../posts/api/input-dto/posts.query-params.dto';
import type { CreatePostForBlogDto } from '../../posts/dto/create-post.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async findAll(@Query() query: BlogsQueryParams) {
    return await this.blogsQueryRepository.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.findOne(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    const blogId = await this.blogsService.create(createBlogDto);
    return await this.blogsQueryRepository.findOne(blogId);
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return await this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return await this.blogsService.remove(id);
  }

  // posts for blog
  @Get(':id/posts')
  async findPostsForBlog(
    @Param('id') id: string,
    @Query() query: PostsQueryParams,
  ) {
    const blog = await this.blogsService.getBlogById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return await this.postsQueryRepository.findAll(blog._id.toString(), query);
  }

  @Post(':id/posts')
  async createPostForBlog(
    @Param('id') id: string,
    @Body() dto: CreatePostForBlogDto,
  ) {
    const postId = await this.blogsService.createPostForBlog(id, dto);
    return await this.postsQueryRepository.findOne(postId);
  }
}
