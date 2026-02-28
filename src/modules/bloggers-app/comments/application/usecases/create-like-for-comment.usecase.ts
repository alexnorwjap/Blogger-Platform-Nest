import { LikeForCommentsRepository } from '../../infrastructure/like-for-comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentLike } from '../../domain/like-for-comment.entity';
import { LikeForCommentDto } from '../../dto/input-set-like-for-comment.dto';

class CreateLikeForCommentCommand {
  constructor(public readonly dto: LikeForCommentDto) {}
}

@CommandHandler(CreateLikeForCommentCommand)
class CreateLikeForCommentUseCase implements ICommandHandler<CreateLikeForCommentCommand> {
  constructor(private readonly likeForCommentsRepository: LikeForCommentsRepository) {}

  async execute({ dto }: CreateLikeForCommentCommand) {
    const likeForComment = CommentLike.createInstance(dto);
    return await this.likeForCommentsRepository.save(likeForComment);
  }
}

export { CreateLikeForCommentCommand, CreateLikeForCommentUseCase };
