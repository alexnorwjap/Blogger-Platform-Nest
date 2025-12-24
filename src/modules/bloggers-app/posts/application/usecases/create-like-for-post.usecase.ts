import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeForPostDto } from '../../dto/create-like-for-post.dto';
import { LikeForPostRepository } from '../../infrastructure/like-for-post.repository';
import {
  LikeForPost,
  type LikeForPostModelType,
} from '../../domain/like-for-post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument } from '../../domain/post.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';

class CreateLikeForPostCommand {
  constructor(
    public readonly dto: CreateLikeForPostDto,
    public readonly post: PostDocument,
  ) {}
}

@CommandHandler(CreateLikeForPostCommand)
class CreateLikeForPostUseCase implements ICommandHandler<CreateLikeForPostCommand> {
  constructor(
    @InjectModel(LikeForPost.name)
    private likeForPostModel: LikeForPostModelType,
    private readonly likeForPostRepository: LikeForPostRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute({ dto, post }: CreateLikeForPostCommand) {
    const likeForPost = this.likeForPostModel.create(dto);
    await this.likeForPostRepository.save(likeForPost);

    post.applyFirstReaction(likeForPost.likeStatus);
    await this.postsRepository.save(post);
  }
}

export { CreateLikeForPostCommand, CreateLikeForPostUseCase };
