import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Get,
  HttpCode,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { PostsQueryParams } from './input-dto/posts.query-params.dto';
import { CommentsQueryParams } from '../../comments/api/input-dto/comments.query-params.dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query-repository';
import { IdInputUUIDDTO } from '../../../../core/dto/id-params.dto';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../user-account/guards/bearer/jwt-auth.guard';
import ExtractUserFromRequest from '../../../user-account/guards/decorators/extract-user-from-req.decorators';
import UserContextDto from '../../../user-account/guards/dto/user.context.dto';
import { InputCommentDto } from '../../comments/api/input-dto/comment.dto';
import { CreateCommentCommand } from '../../comments/application/usecases/create-comment.usecase';
import { UpdateLikeInputDto } from '../../../../core/dto/update-like-input.dto';
import { SetLikeStatusForPostCommand } from '../application/usecases/set-like-status-for-post.usecase';
import { JwtOptionalAuthGuard } from '../../../user-account/guards/bearer/jwt-optional-auth-guard';
import { DomainExceptionCode } from '../../../../core/exceptions/filters/domain-exceptions-code';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { PostsRepository } from '../infrastructure/posts.repository';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly postsRepository: PostsRepository,
  ) {}
  @Get()
  @UseGuards(JwtOptionalAuthGuard)
  async getAll(
    @Query() query: PostsQueryParams,
    @ExtractUserFromRequest() user: UserContextDto | null,
  ) {
    return await this.postsQueryRepository.findAll(null, query, user);
  }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  async getOne(
    @Param() { id }: IdInputUUIDDTO,
    @ExtractUserFromRequest() user: UserContextDto | null,
  ) {
    return await this.postsQueryRepository.findOne(id, user);
  }

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

  @Get(':id/comments')
  @UseGuards(JwtOptionalAuthGuard)
  async getComments(
    @Query() query: CommentsQueryParams,
    @Param() { id }: IdInputUUIDDTO,
    @ExtractUserFromRequest() user: UserContextDto | null,
  ) {
    const post = await this.postsRepository.getPostById(id);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
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
