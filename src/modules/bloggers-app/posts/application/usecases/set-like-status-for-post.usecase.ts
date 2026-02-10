import { LikeForPostContextDto } from '../../dto/like-for-post-context.dto';
import { GetPostByIdQuery } from '../queries/getPostById.query';
import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { CreateLikeForPostCommand } from './create-like-for-post.usecase';
import { UpdateLikeForPostCommand } from './update-like-for-post.usecase';
import { GetLikeForPostQuery } from '../queries/getLikeForPost.query';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';

class SetLikeStatusForPostCommand {
  constructor(public readonly dto: LikeForPostContextDto) {}
}

@CommandHandler(SetLikeStatusForPostCommand)
class SetLikeStatusForPostUseCase implements ICommandHandler<SetLikeStatusForPostCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ dto }: SetLikeStatusForPostCommand) {
    const post = await this.queryBus.execute(new GetPostByIdQuery(dto.postId));
    const user = await this.userRepository.getUserById(dto.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    const likeForPost = await this.queryBus.execute(new GetLikeForPostQuery(post.id, user.id));
    if (!likeForPost) {
      return await this.commandBus.execute(
        new CreateLikeForPostCommand({
          userId: user.id,
          postId: post.id,
          likeStatus: dto.likeStatus,
          login: user.login,
        }),
      );
    }

    if (likeForPost.likeStatus === dto.likeStatus) return;
    await this.commandBus.execute(new UpdateLikeForPostCommand(likeForPost.id, dto.likeStatus));
  }
}

export { SetLikeStatusForPostCommand, SetLikeStatusForPostUseCase };
