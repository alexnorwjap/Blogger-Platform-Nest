import {
  Command,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { CreatePostInputDto } from '../../dto/create-post.dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { GetBlogByIdQuery } from 'src/modules/bloggers-app/blogs/application/queries/get-blog.query';

class CreatePostCommand extends Command<{ postId: string }> {
  constructor(public readonly dto: CreatePostInputDto) {
    super();
  }
}

@CommandHandler(CreatePostCommand)
class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute({ dto }: CreatePostCommand) {
    const blog = await this.queryBus.execute(new GetBlogByIdQuery(dto.blogId));

    const postId = await this.postsRepository.createPost({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blog.id,
      blogName: blog.name,
    });
    return {
      postId,
    };
  }
}

export { CreatePostCommand, CreatePostUseCase };
