import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeForCommentsRepository } from '../../infrastructure/like-for-comments.repository';
import { LikeForCommentDocument } from '../../domain/like-for-comment.entity';
import { CommentDocument } from '../../domain/comments.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';

type UpdateLikeForCommentDto = {
  comment: CommentDocument;
  likeForComment: LikeForCommentDocument;
  likeStatus: string;
};

class UpdateLikeForCommentCommand {
  constructor(public readonly dto: UpdateLikeForCommentDto) {}
}

@CommandHandler(UpdateLikeForCommentCommand)
class UpdateLikeForCommentUseCase implements ICommandHandler<UpdateLikeForCommentCommand> {
  constructor(
    private readonly likeForCommentsRepository: LikeForCommentsRepository,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute({ dto }: UpdateLikeForCommentCommand) {
    if (dto.likeForComment.likeStatus === dto.likeStatus) return;

    dto.comment.updateLikesCount(dto.likeForComment.likeStatus, dto.likeStatus);
    dto.likeForComment.updateStatus(dto.likeStatus);
    await this.likeForCommentsRepository.save(dto.likeForComment);
    await this.commentsRepository.save(dto.comment);
  }
}
export { UpdateLikeForCommentCommand, UpdateLikeForCommentUseCase };
