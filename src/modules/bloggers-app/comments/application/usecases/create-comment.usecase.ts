import { Command, QueryBus } from '@nestjs/cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from 'src/modules/user-account/application/queries/user/getUserById.query';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { InputCreateCommentDto } from '../../dto/createCommentDto';
import { GetPostByIdQuery } from 'src/modules/bloggers-app/posts/application/queries/getPostById.query';

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
  ) {}

  async execute({ dto }: CreateCommentCommand) {
    await this.queryBus.execute(new GetPostByIdQuery(dto.postId));
    const user = await this.queryBus.execute(new GetUserByIdQuery(dto.userId));
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
