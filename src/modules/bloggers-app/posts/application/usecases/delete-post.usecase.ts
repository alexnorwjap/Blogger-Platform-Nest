import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { GetPostByIdQuery } from '../queries/getPostById.query';

class DeletePostCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeletePostCommand)
class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute({ id }: DeletePostCommand) {
    await this.queryBus.execute(new GetPostByIdQuery(id));
    await this.postsRepository.updatePost(id, { deletedAt: new Date() });
  }
}

export { DeletePostCommand, DeletePostUseCase };
