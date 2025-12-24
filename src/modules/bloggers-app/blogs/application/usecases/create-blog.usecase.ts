import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogDto } from 'src/modules/bloggers-app/blogs/dto/create-blog.dto';
import { BlogsRepository } from 'src/modules/bloggers-app/blogs/infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import type { BlogModelType } from 'src/modules/bloggers-app/blogs/domain/blog.entity';
import { Blog } from 'src/modules/bloggers-app/blogs/domain/blog.entity';

class CreateBlogCommand extends Command<{ blogId: string }> {
  constructor(public readonly dto: CreateBlogDto) {
    super();
  }
}

@CommandHandler(CreateBlogCommand)
class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private BlogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreateBlogCommand) {
    const blog = this.BlogModel.create(dto);
    await this.BlogsRepository.save(blog);
    return {
      blogId: blog._id.toString(),
    };
  }
}
export { CreateBlogCommand, CreateBlogUseCase };
