import { InjectModel } from '@nestjs/mongoose';
import { LikeForCommentsRepository } from '../../infrastructure/like-for-comments.repository';
import type { LikeForCommentModelType } from '../../domain/like-for-comment.entity';
import { LikeForComment } from '../../domain/like-for-comment.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDocument } from 'src/modules/user-account/domain/user.entity';
import { CommentDocument } from '../../domain/comments.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';

class CreateLikeForCommentDto {
  user: UserDocument;
  comment: CommentDocument;
  likeStatus: string;
}

class CreateLikeForCommentCommand {
  constructor(public readonly dto: CreateLikeForCommentDto) {}
}

@CommandHandler(CreateLikeForCommentCommand)
class CreateLikeForCommentUseCase implements ICommandHandler<CreateLikeForCommentCommand> {
  constructor(
    @InjectModel(LikeForComment.name)
    private readonly likeForCommentModel: LikeForCommentModelType,
    private readonly likeForCommentsRepository: LikeForCommentsRepository,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute({ dto }: CreateLikeForCommentCommand) {
    const likeForComment = this.likeForCommentModel.createInstance({
      userId: dto.user._id.toString(),
      login: dto.user.login,
      commentId: dto.comment._id.toString(),
      likeStatus: dto.likeStatus,
    });
    await this.likeForCommentsRepository.save(likeForComment);
    dto.comment.applyFirstReaction(dto.likeStatus);
    await this.commentsRepository.save(dto.comment);
  }
}

export { CreateLikeForCommentCommand, CreateLikeForCommentUseCase };
