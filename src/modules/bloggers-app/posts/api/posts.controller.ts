import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Get,
  Delete,
  HttpCode,
  NotFoundException,
  Query,
} from '@nestjs/common';
import type { CreatePostDto } from '../dto/create-post.dto';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { PostsQueryParams } from './input-dto/posts.query-params.dto';
import type { UpdatePostDto } from '../dto/update-post.dto';
import { CommentsQueryParams } from '../../comments/api/input-dto/comments.query-params.dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query-repository';
import { IdInputDTO } from 'src/core/dto/id-params.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Get()
  async findAll(@Query() query: PostsQueryParams) {
    return await this.postsQueryRepository.findAll(null, query);
  }
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const postId = await this.postsService.create(createPostDto);
    return await this.postsQueryRepository.findOne(postId);
  }
  @Get(':id')
  async getOne(@Param() { id }: IdInputDTO) {
    const post = await this.postsQueryRepository.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
  @Put(':id')
  @HttpCode(204)
  async update(@Param() { id }: IdInputDTO, @Body() dto: UpdatePostDto) {
    return await this.postsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() { id }: IdInputDTO) {
    return await this.postsService.delete(id);
  }

  // comments for posts
  @Get(':id/comments')
  async getComments(
    @Query() query: CommentsQueryParams,
    @Param() { id }: IdInputDTO,
  ) {
    return await this.commentsQueryRepository.findAllbyId(id, query);
  }
}
