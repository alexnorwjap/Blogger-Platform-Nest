import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';

class DeleteBlogCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteBlogCommand)
class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand) {
    const blog = await this.blogsRepository.getBlogById(id);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    await this.blogsRepository.delete(id);
  }
}
export { DeleteBlogCommand, DeleteBlogUseCase };
