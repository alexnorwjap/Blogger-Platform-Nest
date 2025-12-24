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
import { GetBlogByIdQuery } from '../application/queries/get-blog.query';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { BlogsQueryParams } from './input-dto/blogs.query-params.dto';
import { PostsQueryParams } from '../../posts/api/input-dto/posts.query-params.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { IdInputDTO } from '../../../../core/dto/id-params.dto';
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
import { Public } from 'src/modules/user-account/guards/decorators/public.decorator';
import { InputPostForBlogReqBodyDto } from './input-dto/posts-for-blog.input-req-body.dto';
@Controller('blogs')
@UseGuards(BasicAuthGuard)
export class BlogsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @Public()
  async findAll(@Query() query: BlogsQueryParams) {
    return await this.blogsQueryRepository.findAll(query);
  }

  @Get(':id')
  @Public()
  async findOne(@Param() { id }: IdInputDTO) {
    return await this.blogsQueryRepository.findOne(id);
  }

  @Post()
  async create(@Body() dto: InputBlogReqBodyDto) {
    const { blogId } = await this.commandBus.execute(
      new CreateBlogCommand(dto),
    );
    return await this.blogsQueryRepository.findOne(blogId);
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param() { id }: IdInputDTO, @Body() dto: InputBlogReqBodyDto) {
    return await this.commandBus.execute(new UpdateBlogCommand(id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param() { id }: IdInputDTO) {
    return await this.commandBus.execute(new DeleteBlogCommand(id));
  }

  // posts for blog
  @Get(':id/posts')
  @Public()
  @UseGuards(JwtOptionalAuthGuard)
  async findPostsForBlog(
    @Param() { id }: IdInputDTO,
    @Query() query: PostsQueryParams,
    @ExtractUserFromRequest() user: UserContextDto | null,
  ) {
    const blog = await this.queryBus.execute(new GetBlogByIdQuery(id));
    return await this.postsQueryRepository.findAll(
      blog._id.toString(),
      query,
      user,
    );
  }

  @Post(':id/posts')
  @UseGuards(JwtOptionalAuthGuard)
  async createPostForBlog(
    @Param() { id }: IdInputDTO,
    @Body() dto: InputPostForBlogReqBodyDto,
    @ExtractUserFromRequest() user: UserContextDto | null,
  ) {
    const { postId } = await this.commandBus.execute(
      new CreatePostForBlogCommand(id, dto),
    );
    return await this.postsQueryRepository.findOne(postId, user);
  }
}
