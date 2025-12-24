import { UpdateBlogDto } from 'src/modules/bloggers-app/blogs/dto/update-blog.dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { GetBlogByIdQuery } from '../queries/get-blog.query';

class UpdateBlogCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute({ id, dto }: UpdateBlogCommand) {
    const blog = await this.queryBus.execute(new GetBlogByIdQuery(id));
    blog.updateBlog(dto);
    await this.blogsRepository.save(blog);
  }
}

export { UpdateBlogCommand, UpdateBlogUseCase };
