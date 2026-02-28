import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeForPostDto } from '../../dto/create-like-for-post.dto';
import { LikeForPostRepository } from '../../infrastructure/like-for-post.repository';
import { PostLike } from '../../domain/like-for-post.entity';

class CreateLikeForPostCommand {
  constructor(public readonly dto: CreateLikeForPostDto) {}
}

@CommandHandler(CreateLikeForPostCommand)
class CreateLikeForPostUseCase implements ICommandHandler<CreateLikeForPostCommand> {
  constructor(private readonly likeForPostRepository: LikeForPostRepository) {}

  async execute({ dto }: CreateLikeForPostCommand) {
    const likeForPost = PostLike.createInstance(dto);
    await this.likeForPostRepository.save(likeForPost);
  }
}

export { CreateLikeForPostCommand, CreateLikeForPostUseCase };
