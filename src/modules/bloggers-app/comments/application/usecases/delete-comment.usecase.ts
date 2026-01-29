import { InputDeleteCommentDto } from '../../dto/deleteCommentDto';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { GetCommentByIdQuery } from '../queries/get-comment.query';

class DeleteCommentCommand {
  constructor(public readonly dto: InputDeleteCommentDto) {}
}

@CommandHandler(DeleteCommentCommand)
class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ dto }: DeleteCommentCommand) {
    const comment = await this.queryBus.execute(new GetCommentByIdQuery(dto.commentId));
    if (comment.commentatorInfo.userId !== dto.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
      });
    }
    await this.commentsRepository.updateComment(dto.commentId, { deletedAt: new Date() });
  }
}

export { DeleteCommentCommand, DeleteCommentUseCase };
