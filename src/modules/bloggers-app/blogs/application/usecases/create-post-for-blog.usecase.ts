import { Command, CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from 'src/modules/bloggers-app/posts/application/usecases/create-post.usecase';
import { CreatePostForBlogDto } from 'src/modules/bloggers-app/posts/dto/create-post.dto';

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
  constructor(private readonly commandBus: CommandBus) {}
  async execute({ blogId, dto }: CreatePostForBlogCommand) {
    return await this.commandBus.execute(new CreatePostCommand({ ...dto, blogId }));
  }
}

export { CreatePostForBlogCommand, CreatePostForBlogUseCase };
