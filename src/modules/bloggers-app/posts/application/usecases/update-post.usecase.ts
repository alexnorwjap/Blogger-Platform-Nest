import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { BlogsRepository } from 'src/modules/bloggers-app/blogs/infrastructure/blogs.repository';

class UpdatePostCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute({ id, dto }: UpdatePostCommand) {
    const post = await this.postsRepository.getPostById(id);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }

    const blog = await this.blogsRepository.getBlogById(dto.blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;

    await this.postsRepository.save(post);
  }
}

export { UpdatePostCommand, UpdatePostUseCase };
