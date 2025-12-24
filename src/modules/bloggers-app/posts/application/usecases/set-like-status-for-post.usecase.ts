import { GetUserByIdQuery } from 'src/modules/user-account/application/queries/user/getUserById.query';
import { LikeForPostContextDto } from '../../dto/like-for-post-context.dto';
import { GetPostByIdQuery } from '../queries/getPostById.query';
import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { LikeForPostRepository } from '../../infrastructure/like-for-post.repository';
import { CreateLikeForPostCommand } from './create-like-for-post.usecase';
import { UpdateLikeForPostCommand } from './update-like-for-post.usecase';

class SetLikeStatusForPostCommand {
  constructor(public readonly dto: LikeForPostContextDto) {}
}

@CommandHandler(SetLikeStatusForPostCommand)
class SetLikeStatusForPostUseCase implements ICommandHandler<SetLikeStatusForPostCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly likeForPostRepository: LikeForPostRepository,
  ) {}

  async execute({ dto }: SetLikeStatusForPostCommand) {
    const post = await this.queryBus.execute(new GetPostByIdQuery(dto.postId));
    const user = await this.queryBus.execute(new GetUserByIdQuery(dto.userId));
    const likeForPost = await this.likeForPostRepository.findLikeForPost(
      post._id.toString(),
      user._id.toString(),
    );

    if (!likeForPost) {
      return await this.commandBus.execute(
        new CreateLikeForPostCommand(
          {
            userId: user._id.toString(),
            postId: post._id.toString(),
            likeStatus: dto.likeStatus,
            login: user.login,
          },
          post,
        ),
      );
    }

    await this.commandBus.execute(
      new UpdateLikeForPostCommand(likeForPost, post, dto.likeStatus),
    );
  }
}

export { SetLikeStatusForPostCommand, SetLikeStatusForPostUseCase };
