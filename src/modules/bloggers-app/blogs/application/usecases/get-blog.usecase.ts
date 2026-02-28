import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Blog } from 'src/modules/bloggers-app/blogs/domain/blog.entity';
import { BlogsRepository } from 'src/modules/bloggers-app/blogs/infrastructure/blogs.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';

class GetBlogByIdCommand extends Command<Blog> {
  constructor(public readonly blogId: string) {
    super();
  }
}

@CommandHandler(GetBlogByIdCommand)
class GetBlogByIdUseCase implements ICommandHandler<GetBlogByIdCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ blogId }: GetBlogByIdCommand) {
    const blog = await this.blogsRepository.getBlogById(blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    return blog;
  }
}

export { GetBlogByIdCommand, GetBlogByIdUseCase };
