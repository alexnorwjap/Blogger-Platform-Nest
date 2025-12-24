import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query-repository';
import { IdInputDTO } from 'src/core/dto/id-params.dto';
import { InputCommentDto } from './input-dto/comment.dto';
import { CommandBus } from '@nestjs/cqrs';
import ExtractUserFromRequest from 'src/modules/user-account/guards/decorators/extract-user-from-req.decorators';
import UserContextDto from 'src/modules/user-account/guards/dto/user.context.dto';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { JwtAuthGuard } from 'src/modules/user-account/guards/bearer/jwt-auth.guard';
import { Public } from 'src/modules/user-account/guards/decorators/public.decorator';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { UpdateLikeInputDto } from 'src/core/dto/update-like-input.dto';
import { SetLikeStatusForCommentCommand } from '../application/usecases/set-like-status-for-comment.usecase';
import { JwtOptionalAuthGuard } from 'src/modules/user-account/guards/bearer/jwt-optional-auth-guard';
@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id')
  @Public()
  @UseGuards(JwtOptionalAuthGuard)
  async findOne(
    @Param() { id }: IdInputDTO,
    @ExtractUserFromRequest() user: UserContextDto | null,
  ) {
    return await this.commentsQueryRepository.findOne(id, user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param() { id }: IdInputDTO,
    @Body() dto: InputCommentDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return await this.commandBus.execute(
      new UpdateCommentCommand({ ...dto, commentId: id, userId: user.id }),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param() { id }: IdInputDTO,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return await this.commandBus.execute(
      new DeleteCommentCommand({ commentId: id, userId: user.id }),
    );
  }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setLikeStatusForComment(
    @Param() { id }: IdInputDTO,
    @Body() dto: UpdateLikeInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return await this.commandBus.execute(
      new SetLikeStatusForCommentCommand({
        commentId: id,
        userId: user.id,
        likeStatus: dto.likeStatus,
      }),
    );
  }
}
