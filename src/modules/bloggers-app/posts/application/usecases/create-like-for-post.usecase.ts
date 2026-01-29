import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeForPostDto } from '../../dto/create-like-for-post.dto';
import { LikeForPostRepository } from '../../infrastructure/like-for-post.repository';

class CreateLikeForPostCommand {
  constructor(public readonly dto: CreateLikeForPostDto) {}
}

@CommandHandler(CreateLikeForPostCommand)
class CreateLikeForPostUseCase implements ICommandHandler<CreateLikeForPostCommand> {
  constructor(private readonly likeForPostRepository: LikeForPostRepository) {}

  async execute({ dto }: CreateLikeForPostCommand) {
    await this.likeForPostRepository.create({
      userId: dto.userId,
      login: dto.login,
      postId: dto.postId,
      likeStatus: dto.likeStatus,
    });
  }
}

export { CreateLikeForPostCommand, CreateLikeForPostUseCase };
