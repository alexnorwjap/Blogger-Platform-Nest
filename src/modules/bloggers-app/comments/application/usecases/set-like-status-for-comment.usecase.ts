import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeForCommentDto } from '../../dto/input-set-like-for-comment.dto';
import { GetCommentByIdCommand } from './get-comment.usecase';
import { LikeForCommentsRepository } from '../../infrastructure/like-for-comments.repository';
import { CreateLikeForCommentCommand } from './create-like-for-comment.usecase';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';
class SetLikeStatusForCommentCommand {
  constructor(public readonly dto: LikeForCommentDto) {}
}

@CommandHandler(SetLikeStatusForCommentCommand)
class SetLikeStatusForCommentUseCase implements ICommandHandler<SetLikeStatusForCommentCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly likeForCommentsRepository: LikeForCommentsRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ dto }: SetLikeStatusForCommentCommand) {
    const comment = await this.commandBus.execute(new GetCommentByIdCommand(dto.commentId));
    const user = await this.userRepository.getUserById(dto.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    const likeForComment = await this.likeForCommentsRepository.findLikeForComment(
      comment.id,
      user.id,
    );

    if (!likeForComment) {
      return await this.commandBus.execute(
        new CreateLikeForCommentCommand({
          userId: user.id,
          commentId: comment.id,
          likeStatus: dto.likeStatus,
        }),
      );
    }
    if (likeForComment.likeStatus === dto.likeStatus) return;
    likeForComment.likeStatus = dto.likeStatus;
    await this.likeForCommentsRepository.save(likeForComment);
  }
}

export { SetLikeStatusForCommentCommand, SetLikeStatusForCommentUseCase };
