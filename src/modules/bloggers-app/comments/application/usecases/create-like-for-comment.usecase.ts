import { LikeForCommentsRepository } from '../../infrastructure/like-for-comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserTypeORM } from 'src/modules/user-account/domain/user-typeorm.entity';

class CreateLikeForCommentDto {
  user: UserTypeORM;
  commentId: string;
  likeStatus: string;
}

class CreateLikeForCommentCommand {
  constructor(public readonly dto: CreateLikeForCommentDto) {}
}

@CommandHandler(CreateLikeForCommentCommand)
class CreateLikeForCommentUseCase implements ICommandHandler<CreateLikeForCommentCommand> {
  constructor(private readonly likeForCommentsRepository: LikeForCommentsRepository) {}

  async execute({ dto }: CreateLikeForCommentCommand) {
    return await this.likeForCommentsRepository.create({
      userId: dto.user.id,
      login: dto.user.login,
      commentId: dto.commentId,
      likeStatus: dto.likeStatus,
    });
  }
}

export { CreateLikeForCommentCommand, CreateLikeForCommentUseCase };
