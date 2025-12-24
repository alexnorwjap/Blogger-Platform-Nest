import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InputUpdateCommentDto } from '../../dto/updateCommentsDto';
import { GetCommentByIdQuery } from '../queries/get-comment.query';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';

class UpdateCommentCommand {
  constructor(public readonly dto: InputUpdateCommentDto) {}
}

@CommandHandler(UpdateCommentCommand)
class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute({ dto }: UpdateCommentCommand) {
    const comment = await this.queryBus.execute(
      new GetCommentByIdQuery(dto.commentId),
    );
    if (comment.commentatorInfo.userId !== dto.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
      });
    }
    comment.update(dto.content);
    await this.commentsRepository.save(comment);
  }
}

export { UpdateCommentCommand, UpdateCommentUseCase };
