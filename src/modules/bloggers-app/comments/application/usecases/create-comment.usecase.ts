import { Command, CommandBus, QueryBus } from '@nestjs/cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from 'src/modules/user-account/application/queries/user/getUserById.query';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { InputCreateCommentDto } from '../../dto/createCommentDto';
import { InjectModel } from '@nestjs/mongoose';
import type { CommentModelType } from '../../domain/comments.entity';
import { Comment } from '../../domain/comments.entity';
import { GetPostByIdQuery } from 'src/modules/bloggers-app/posts/application/queries/getPostById.query';

class CreateCommentCommand extends Command<{ commentId: string }> {
  constructor(public readonly dto: InputCreateCommentDto) {
    super();
  }
}

@CommandHandler(CreateCommentCommand)
class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectModel(Comment.name)
    private readonly commentModel: CommentModelType,
    private readonly commentsRepository: CommentsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ dto }: CreateCommentCommand) {
    await this.queryBus.execute(new GetPostByIdQuery(dto.postId));
    const user = await this.queryBus.execute(new GetUserByIdQuery(dto.userId));
    const newComment = this.commentModel.createInstance({
      ...dto,
      userId: user.id,
      userLogin: user.login,
    });
    await this.commentsRepository.save(newComment);

    return {
      commentId: newComment._id.toString(),
    };
  }
}

export { CreateCommentCommand, CreateCommentUseCase };
