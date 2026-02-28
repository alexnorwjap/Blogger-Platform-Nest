import { InputDeleteCommentDto } from '../../dto/deleteCommentDto';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetCommentByIdCommand } from './get-comment.usecase';
import { CommandBus } from '@nestjs/cqrs';

class DeleteCommentCommand {
  constructor(public readonly dto: InputDeleteCommentDto) {}
}

@CommandHandler(DeleteCommentCommand)
class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute({ dto }: DeleteCommentCommand) {
    const comment = await this.commandBus.execute(new GetCommentByIdCommand(dto.commentId));
    if (comment.userId !== dto.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
      });
    }
    await this.commentsRepository.delete(dto.commentId);
  }
}

export { DeleteCommentCommand, DeleteCommentUseCase };
