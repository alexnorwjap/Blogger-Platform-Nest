import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Get,
  // Delete,
  HttpCode,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { PostsQueryParams } from './input-dto/posts.query-params.dto';
import { CommentsQueryParams } from '../../comments/api/input-dto/comments.query-params.dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query-repository';
import { IdInputUUIDDTO } from 'src/core/dto/id-params.dto';
// import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
// import { InputPostReqBodyDto } from './input-dto/input.req-body.dto';
// import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
// import { DeletePostCommand } from '../application/usecases/delete-post.usecase';
import { JwtAuthGuard } from 'src/modules/user-account/guards/bearer/jwt-auth.guard';
import ExtractUserFromRequest from 'src/modules/user-account/guards/decorators/extract-user-from-req.decorators';
import UserContextDto from 'src/modules/user-account/guards/dto/user.context.dto';
import { InputCommentDto } from '../../comments/api/input-dto/comment.dto';
import { CreateCommentCommand } from '../../comments/application/usecases/create-comment.usecase';
// import { BasicAuthGuard } from 'src/modules/user-account/guards/basic/basic-auth.guard';
import { UpdateLikeInputDto } from '../../../../core/dto/update-like-input.dto';
import { SetLikeStatusForPostCommand } from '../application/usecases/set-like-status-for-post.usecase';
import { JwtOptionalAuthGuard } from 'src/modules/user-account/guards/bearer/jwt-optional-auth-guard';
import { GetPostByIdQuery } from '../application/queries/getPostById.query';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Get()
  @UseGuards(JwtOptionalAuthGuard)
  async getAll(
    @Query() query: PostsQueryParams,
    @ExtractUserFromRequest() user: UserContextDto | null,
  ) {
    return await this.postsQueryRepository.findAll(null, query, user);
  }
  // @Post()
  // @UseGuards(BasicAuthGuard)
  // async create(@Body() dto: InputPostReqBodyDto) {
  //   const { postId } = await this.commandBus.execute(new CreatePostCommand(dto));
  //   return await this.postsQueryRepository.findOne(postId, null);
  // }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  async getOne(
    @Param() { id }: IdInputUUIDDTO,
    @ExtractUserFromRequest() user: UserContextDto | null,
  ) {
    return await this.postsQueryRepository.findOne(id, user);
  }

  // @Put(':id')
  // @UseGuards(BasicAuthGuard)
  // @HttpCode(204)
  // async update(@Param() { id }: IdInputUUIDDTO, @Body() dto: InputPostReqBodyDto) {
  //   return await this.commandBus.execute(new UpdatePostCommand(id, dto));
  // }

  // @Delete(':id')
  // @UseGuards(BasicAuthGuard)
  // @HttpCode(204)
  // async delete(@Param() { id }: IdInputUUIDDTO) {
  //   return await this.commandBus.execute(new DeletePostCommand(id));
  // }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async updateLikeStatus(
    @Param() { id }: IdInputUUIDDTO,
    @Body() dto: UpdateLikeInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return await this.commandBus.execute(
      new SetLikeStatusForPostCommand({
        postId: id,
        likeStatus: dto.likeStatus,
        userId: user.id,
      }),
    );
  }

  // comments for posts
  @Get(':id/comments')
  @UseGuards(JwtOptionalAuthGuard)
  async getComments(
    @Query() query: CommentsQueryParams,
    @Param() { id }: IdInputUUIDDTO,
    @ExtractUserFromRequest() user: UserContextDto | null,
  ) {
    await this.queryBus.execute(new GetPostByIdQuery(id));
    return await this.commentsQueryRepository.findAllbyId(id, query, user);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param() { id }: IdInputUUIDDTO,
    @Body() dto: InputCommentDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const { commentId } = await this.commandBus.execute(
      new CreateCommentCommand({ ...dto, postId: id, userId: user.id }),
    );
    return await this.commentsQueryRepository.findOne(commentId, null);
  }
}
