import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeForPostRepository } from '../../infrastructure/like-for-post.repository';
import { PostLike } from '../../domain/like-for-post.entity';

export class GetLikeForPostCommand extends Command<PostLike | null> {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
  ) {
    super();
  }
}

@CommandHandler(GetLikeForPostCommand)
export class GetLikeForPostUseCase implements ICommandHandler<
  GetLikeForPostCommand,
  PostLike | null
> {
  constructor(private readonly likeForPostRepository: LikeForPostRepository) {}

  async execute({ postId, userId }: GetLikeForPostCommand): Promise<PostLike | null> {
    return this.likeForPostRepository.findLikeForPost(postId, userId);
  }
}
