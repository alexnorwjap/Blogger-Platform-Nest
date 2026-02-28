import { LikeForPostContextDto } from '../../dto/like-for-post-context.dto';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeForPostCommand } from './create-like-for-post.usecase';
import { GetLikeForPostCommand } from './getLikeForPost.usecase';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { LikeForPostRepository } from '../../infrastructure/like-for-post.repository';

class SetLikeStatusForPostCommand {
  constructor(public readonly dto: LikeForPostContextDto) {}
}

@CommandHandler(SetLikeStatusForPostCommand)
class SetLikeStatusForPostUseCase implements ICommandHandler<SetLikeStatusForPostCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userRepository: UserRepository,
    private readonly postsRepository: PostsRepository,
    private readonly likeForPostRepository: LikeForPostRepository,
  ) {}

  async execute({ dto }: SetLikeStatusForPostCommand) {
    const post = await this.postsRepository.getPostById(dto.postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    const user = await this.userRepository.getUserById(dto.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    const likeForPost = await this.commandBus.execute(new GetLikeForPostCommand(post.id, user.id));
    if (!likeForPost) {
      return await this.commandBus.execute(
        new CreateLikeForPostCommand({
          userId: user.id,
          postId: post.id,
          likeStatus: dto.likeStatus,
        }),
      );
    }

    if (likeForPost.likeStatus === dto.likeStatus) return;
    likeForPost.likeStatus = dto.likeStatus;
    await this.likeForPostRepository.save(likeForPost);
  }
}

export { SetLikeStatusForPostCommand, SetLikeStatusForPostUseCase };
