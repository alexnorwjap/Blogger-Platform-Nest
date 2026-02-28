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
  UseGuards,
} from '@nestjs/common';
import { GetBlogByIdCommand } from '../application/usecases/get-blog.usecase';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { BlogsQueryParams } from './input-dto/blogs.query-params.dto';
import { PostsQueryParams } from '../../posts/api/input-dto/posts.query-params.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { InputBlogReqBodyDto } from './input-dto/blogs.input-req-body.dto';
import { CreatePostForBlogCommand } from '../application/usecases/create-post-for-blog.usecase';
import { JwtOptionalAuthGuard } from 'src/modules/user-account/guards/bearer/jwt-optional-auth-guard';
import ExtractUserFromRequest from 'src/modules/user-account/guards/decorators/extract-user-from-req.decorators';
import UserContextDto from 'src/modules/user-account/guards/dto/user.context.dto';
import { BasicAuthGuard } from 'src/modules/user-account/guards/basic/basic-auth.guard';
import { InputPostForBlogReqBodyDto } from './input-dto/posts-for-blog.input-req-body.dto';
import { IdInputUUIDDTO, PostIdInputUUIDDTO } from 'src/core/dto/id-params.dto';
import { UpdatePostCommand } from '../../posts/application/usecases/update-post.usecase';
import { DeletePostCommand } from '../../posts/application/usecases/delete-post.usecase';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class BlogsSaController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async findAll(@Query() query: BlogsQueryParams) {
    return await this.blogsQueryRepository.findAll(query);
  }

  @Post()
  async create(@Body() dto: InputBlogReqBodyDto) {
    const { blogId } = await this.commandBus.execute(new CreateBlogCommand(dto));
    return await this.blogsQueryRepository.findOne(blogId);
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param() { id }: IdInputUUIDDTO, @Body() dto: InputBlogReqBodyDto) {
    return await this.commandBus.execute(new UpdateBlogCommand(id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param() { id }: IdInputUUIDDTO) {
    return await this.commandBus.execute(new DeleteBlogCommand(id));
  }

  @Get(':id/posts')
  @UseGuards(JwtOptionalAuthGuard)
  async findPostsForBlog(
    @Param() { id }: IdInputUUIDDTO,
    @Query() query: PostsQueryParams,
    @ExtractUserFromRequest() user: UserContextDto | null,
  ) {
    const blog = await this.commandBus.execute(new GetBlogByIdCommand(id));
    return await this.postsQueryRepository.findAll(blog.id, query, user);
  }

  @Post(':id/posts')
  @UseGuards(JwtOptionalAuthGuard)
  async createPostForBlog(
    @Param() { id }: IdInputUUIDDTO,
    @Body() dto: InputPostForBlogReqBodyDto,
    @ExtractUserFromRequest() user: UserContextDto | null,
  ) {
    const { postId } = await this.commandBus.execute(new CreatePostForBlogCommand(id, dto));
    return await this.postsQueryRepository.findOne(postId, user);
  }

  @Put(':id/posts/:postId')
  @HttpCode(204)
  async updatePostForBlog(
    @Param() { id: blogId }: IdInputUUIDDTO,
    @Param() { postId }: PostIdInputUUIDDTO,
    @Body() dto: InputPostForBlogReqBodyDto,
  ) {
    return await this.commandBus.execute(new UpdatePostCommand(postId, { ...dto, blogId: blogId }));
  }

  @Delete(':id/posts/:postId')
  @HttpCode(204)
  async deletePostForBlog(
    @Param() { id: blogId }: IdInputUUIDDTO,
    @Param() { postId }: PostIdInputUUIDDTO,
  ) {
    await this.commandBus.execute(new GetBlogByIdCommand(blogId));
    return await this.commandBus.execute(new DeletePostCommand(postId));
  }
}
