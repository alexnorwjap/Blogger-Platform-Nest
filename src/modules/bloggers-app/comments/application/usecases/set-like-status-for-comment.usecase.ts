import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InputSetLikeForCommentDto } from '../../dto/input-set-like-for-comment.dto';
import { GetCommentByIdQuery } from '../queries/get-comment.query';
import { LikeForCommentsRepository } from '../../infrastructure/like-for-comments.repository';
import { CreateLikeForCommentCommand } from './create-like-for-comment.usecase';
import { UpdateLikeForCommentCommand } from './update-like-for-comment.usecase';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';
class SetLikeStatusForCommentCommand {
  constructor(public readonly dto: InputSetLikeForCommentDto) {}
}

@CommandHandler(SetLikeStatusForCommentCommand)
class SetLikeStatusForCommentUseCase implements ICommandHandler<SetLikeStatusForCommentCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly likeForCommentsRepository: LikeForCommentsRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ dto }: SetLikeStatusForCommentCommand) {
    const comment = await this.queryBus.execute(new GetCommentByIdQuery(dto.commentId));
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
          user,
          commentId: comment.id,
          likeStatus: dto.likeStatus,
        }),
      );
    }
    if (likeForComment.likeStatus === dto.likeStatus) return;
    await this.commandBus.execute(
      new UpdateLikeForCommentCommand({
        likeForCommentId: likeForComment.id,
        likeStatus: dto.likeStatus,
      }),
    );
  }
}

export { SetLikeStatusForCommentCommand, SetLikeStatusForCommentUseCase };
