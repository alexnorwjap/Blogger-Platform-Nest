import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { Comment } from '../../domain/comment.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';

class GetCommentByIdCommand extends Command<Comment> {
  constructor(public readonly commentId: string) {
    super();
  }
}

@CommandHandler(GetCommentByIdCommand)
class GetCommentByIdUseCase implements ICommandHandler<GetCommentByIdCommand> {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute({ commentId }: GetCommentByIdCommand) {
    const comment = await this.commentsRepository.getCommentById(commentId);
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    return comment;
  }
}

export { GetCommentByIdCommand, GetCommentByIdUseCase };
