import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogDto } from 'src/modules/bloggers-app/blogs/dto/create-blog.dto';
import { BlogsRepository } from 'src/modules/bloggers-app/blogs/infrastructure/blogs.repository';
import { Blog } from 'src/modules/bloggers-app/blogs/domain/blog.entity';

class CreateBlogCommand extends Command<{ blogId: string }> {
  constructor(public readonly dto: CreateBlogDto) {
    super();
  }
}

@CommandHandler(CreateBlogCommand)
class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}
  async execute({ dto }: CreateBlogCommand) {
    const blog = Blog.createInstance(dto);
    await this.blogsRepository.save(blog);
    return {
      blogId: blog.id,
    };
  }
}
export { CreateBlogCommand, CreateBlogUseCase };
