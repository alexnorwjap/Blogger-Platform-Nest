import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { GetPostByIdQuery } from '../queries/getPostById.query';

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
    const post = await this.queryBus.execute(new GetPostByIdQuery(id));
    post.update(dto);
    await this.postsRepository.save(post);
  }
}

export { UpdatePostCommand, UpdatePostUseCase };
