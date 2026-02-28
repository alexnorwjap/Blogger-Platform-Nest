import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';

class DeletePostCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeletePostCommand)
class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({ id }: DeletePostCommand) {
    const post = await this.postsRepository.getPostById(id);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    await this.postsRepository.delete(id);
  }
}

export { DeletePostCommand, DeletePostUseCase };
