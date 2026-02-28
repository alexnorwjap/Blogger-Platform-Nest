import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GetBlogByIdCommand } from '../application/usecases/get-blog.usecase';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { BlogsQueryParams } from './input-dto/blogs.query-params.dto';
import { PostsQueryParams } from '../../posts/api/input-dto/posts.query-params.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { CommandBus } from '@nestjs/cqrs';
import { JwtOptionalAuthGuard } from '../../../user-account/guards/bearer/jwt-optional-auth-guard';
import ExtractUserFromRequest from '../../../user-account/guards/decorators/extract-user-from-req.decorators';
import UserContextDto from '../../../user-account/guards/dto/user.context.dto';
import { IdInputUUIDDTO } from '../../../../core/dto/id-params.dto';
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async findAll(@Query() query: BlogsQueryParams) {
    return await this.blogsQueryRepository.findAll(query);
  }

  @Get(':id')
  async findOne(@Param() { id }: IdInputUUIDDTO) {
    return await this.blogsQueryRepository.findOne(id);
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
}
