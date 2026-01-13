import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { InputSetLikeForCommentDto } from '../../dto/input-set-like-for-comment.dto';
import { GetCommentByIdQuery } from '../queries/get-comment.query';
import { GetUserByIdQuery } from 'src/modules/user-account/application/queries/user/getUserById.query';
import { LikeForCommentsRepository } from '../../infrastructure/like-for-comments.repository';
import { CreateLikeForCommentCommand } from './create-like-for-comment.usecase';
import { UpdateLikeForCommentCommand } from './update-like-for-comment.usecase';

class SetLikeStatusForCommentCommand {
  constructor(public readonly dto: InputSetLikeForCommentDto) {}
}

@CommandHandler(SetLikeStatusForCommentCommand)
class SetLikeStatusForCommentUseCase implements ICommandHandler<SetLikeStatusForCommentCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly likeForCommentsRepository: LikeForCommentsRepository,
  ) {}

  async execute({ dto }: SetLikeStatusForCommentCommand) {
    const comment = await this.queryBus.execute(
      new GetCommentByIdQuery(dto.commentId),
    );
    const user = await this.queryBus.execute(new GetUserByIdQuery(dto.userId));
    const likeForComment =
      await this.likeForCommentsRepository.findLikeForComment(
        comment._id.toString(),
        user.id,
      );

    if (!likeForComment) {
      return await this.commandBus.execute(
        new CreateLikeForCommentCommand({
          user,
          comment,
          likeStatus: dto.likeStatus,
        }),
      );
    }
    await this.commandBus.execute(
      new UpdateLikeForCommentCommand({
        likeForComment,
        comment,
        likeStatus: dto.likeStatus,
      }),
    );
  }
}

export { SetLikeStatusForCommentCommand, SetLikeStatusForCommentUseCase };
