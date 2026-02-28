import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InputUpdateCommentDto } from '../../dto/updateCommentsDto';
import { GetCommentByIdCommand } from './get-comment.usecase';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';

class UpdateCommentCommand {
  constructor(public readonly dto: InputUpdateCommentDto) {}
}

@CommandHandler(UpdateCommentCommand)
class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute({ dto }: UpdateCommentCommand) {
    const comment = await this.commandBus.execute(new GetCommentByIdCommand(dto.commentId));
    if (comment.userId !== dto.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
      });
    }
    comment.content = dto.content;
    await this.commentsRepository.save(comment);
  }
}

export { UpdateCommentCommand, UpdateCommentUseCase };
