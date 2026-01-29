import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeForCommentsRepository } from '../../infrastructure/like-for-comments.repository';

type UpdateLikeForCommentDto = {
  likeForCommentId: string;
  likeStatus: string;
};

class UpdateLikeForCommentCommand {
  constructor(public readonly dto: UpdateLikeForCommentDto) {}
}

@CommandHandler(UpdateLikeForCommentCommand)
class UpdateLikeForCommentUseCase implements ICommandHandler<UpdateLikeForCommentCommand> {
  constructor(private readonly likeForCommentsRepository: LikeForCommentsRepository) {}

  async execute({ dto }: UpdateLikeForCommentCommand) {
    await this.likeForCommentsRepository.update(dto.likeForCommentId, {
      likeStatus: dto.likeStatus,
    });
  }
}
export { UpdateLikeForCommentCommand, UpdateLikeForCommentUseCase };
