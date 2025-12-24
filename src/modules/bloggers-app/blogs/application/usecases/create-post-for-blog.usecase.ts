import {
  Command,
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { CreatePostCommand } from 'src/modules/bloggers-app/posts/application/usecases/create-post.usecase';
import { CreatePostForBlogDto } from 'src/modules/bloggers-app/posts/dto/create-post.dto';
import { GetBlogByIdQuery } from '../queries/get-blog.query';

class CreatePostForBlogCommand extends Command<{ postId: string }> {
  constructor(
    public readonly blogId: string,
    public readonly dto: CreatePostForBlogDto,
  ) {
    super();
  }
}

@CommandHandler(CreatePostForBlogCommand)
class CreatePostForBlogUseCase implements ICommandHandler<CreatePostForBlogCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  async execute({ blogId, dto }: CreatePostForBlogCommand) {
    const blog = await this.queryBus.execute(new GetBlogByIdQuery(blogId));
    return await this.commandBus.execute(
      new CreatePostCommand({ ...dto, blogId: blog._id.toString() }),
    );
  }
}

export { CreatePostForBlogCommand, CreatePostForBlogUseCase };
