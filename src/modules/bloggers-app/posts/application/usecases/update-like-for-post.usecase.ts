import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeForPostRepository } from '../../infrastructure/like-for-post.repository';

class UpdateLikeForPostCommand {
  constructor(
    public readonly likeForPostId: string,
    public readonly newLikeStatus: string,
  ) {}
}

@CommandHandler(UpdateLikeForPostCommand)
class UpdateLikeForPostUseCase implements ICommandHandler<UpdateLikeForPostCommand> {
  constructor(public readonly likeForPostRepository: LikeForPostRepository) {}

  async execute({ likeForPostId, newLikeStatus }: UpdateLikeForPostCommand) {
    await this.likeForPostRepository.update(likeForPostId, {
      likeStatus: newLikeStatus,
    });
  }
}

export { UpdateLikeForPostCommand, UpdateLikeForPostUseCase };
