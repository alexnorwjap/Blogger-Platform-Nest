import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { GetBlogByIdQuery } from '../queries/get-blog.query';

class DeleteBlogCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteBlogCommand)
class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute({ id }: DeleteBlogCommand) {
    const blog = await this.queryBus.execute(new GetBlogByIdQuery(id));
    blog.delete();
    await this.blogsRepository.save(blog);
  }
}
export { DeleteBlogCommand, DeleteBlogUseCase };
