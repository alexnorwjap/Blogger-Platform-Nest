import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { GetPostByIdQuery } from '../queries/getPostById.query';
import { GetBlogByIdQuery } from 'src/modules/bloggers-app/blogs/application/queries/get-blog.query';

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
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ id, dto }: UpdatePostCommand) {
    await this.queryBus.execute(new GetPostByIdQuery(id));
    await this.queryBus.execute(new GetBlogByIdQuery(dto.blogId));
    await this.postsRepository.updatePost(id, dto);
  }
}

export { UpdatePostCommand, UpdatePostUseCase };
