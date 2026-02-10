import { Command, QueryBus } from '@nestjs/cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { InputCreateCommentDto } from '../../dto/createCommentDto';
import { GetPostByIdQuery } from 'src/modules/bloggers-app/posts/application/queries/getPostById.query';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';

class CreateCommentCommand extends Command<{ commentId: string }> {
  constructor(public readonly dto: InputCreateCommentDto) {
    super();
  }
}

@CommandHandler(CreateCommentCommand)
class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly queryBus: QueryBus,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ dto }: CreateCommentCommand) {
    // TODO: query bus -> repository
    await this.queryBus.execute(new GetPostByIdQuery(dto.postId));

    const user = await this.userRepository.getUserById(dto.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    const newComment = await this.commentsRepository.createComment({
      content: dto.content,
      postId: dto.postId,
      userId: user.id,
      userLogin: user.login,
    });

    return {
      commentId: newComment,
    };
  }
}

export { CreateCommentCommand, CreateCommentUseCase };
