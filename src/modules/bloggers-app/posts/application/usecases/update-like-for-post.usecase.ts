import type { PostDocument } from '../../domain/post.entity';
import type { LikeForPostDocument } from '../../domain/like-for-post.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { LikeForPostRepository } from '../../infrastructure/like-for-post.repository';

class UpdateLikeForPostCommand {
  constructor(
    public readonly likeForPost: LikeForPostDocument,
    public readonly post: PostDocument,
    public readonly newLikeStatus: string,
  ) {}
}

@CommandHandler(UpdateLikeForPostCommand)
class UpdateLikeForPostUseCase implements ICommandHandler<UpdateLikeForPostCommand> {
  constructor(
    private readonly postsRepository: PostsRepository,
    public readonly likeForPostRepository: LikeForPostRepository,
  ) {}

  async execute({
    likeForPost,
    post,
    newLikeStatus,
  }: UpdateLikeForPostCommand) {
    if (likeForPost.likeStatus === newLikeStatus) return;

    post.updateLikesCount(likeForPost.likeStatus, newLikeStatus);
    likeForPost.updateStatus(newLikeStatus);
    await this.likeForPostRepository.save(likeForPost);
    await this.postsRepository.save(post);
  }
}

export { UpdateLikeForPostCommand, UpdateLikeForPostUseCase };
