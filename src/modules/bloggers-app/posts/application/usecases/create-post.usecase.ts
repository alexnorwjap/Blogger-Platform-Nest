import {
  Command,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { CreatePostDto } from '../../dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../domain/post.entity';
import type { PostModelType } from '../../domain/post.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { GetBlogByIdQuery } from 'src/modules/bloggers-app/blogs/application/queries/get-blog.query';

class CreatePostCommand extends Command<{ postId: string }> {
  constructor(public readonly dto: CreatePostDto) {
    super();
  }
}

@CommandHandler(CreatePostCommand)
class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private PostsRepository: PostsRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute({ dto }: CreatePostCommand) {
    const blog = await this.queryBus.execute(new GetBlogByIdQuery(dto.blogId));
    const post = this.PostModel.create(dto, blog.name);
    await this.PostsRepository.save(post);
    return {
      postId: post._id.toString(),
    };
  }
}

export { CreatePostCommand, CreatePostUseCase };
