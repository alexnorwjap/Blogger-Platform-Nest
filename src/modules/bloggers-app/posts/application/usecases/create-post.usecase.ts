import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostInputDto } from '../../dto/create-post.dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { BlogsRepository } from 'src/modules/bloggers-app/blogs/infrastructure/blogs.repository';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { Post } from '../../domain/post.entity';

class CreatePostCommand extends Command<{ postId: string }> {
  constructor(public readonly dto: CreatePostInputDto) {
    super();
  }
}

@CommandHandler(CreatePostCommand)
class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}
  async execute({ dto }: CreatePostCommand) {
    const blog = await this.blogsRepository.getBlogById(dto.blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    const post = Post.createInstance({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
    });
    await this.postsRepository.save(post);

    return {
      postId: post.id,
    };
  }
}

export { CreatePostCommand, CreatePostUseCase };
