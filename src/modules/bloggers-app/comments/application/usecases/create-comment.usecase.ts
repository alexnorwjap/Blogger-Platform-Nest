import { Command } from '@nestjs/cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { InputCreateCommentDto } from '../../dto/createCommentDto';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { PostsRepository } from 'src/modules/bloggers-app/posts/infrastructure/posts.repository';
import { Comment } from '../../domain/comment.entity';

class CreateCommentCommand extends Command<{ commentId: string }> {
  constructor(public readonly dto: InputCreateCommentDto) {
    super();
  }
}

@CommandHandler(CreateCommentCommand)
class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostsRepository,
  ) {}

  async execute({ dto }: CreateCommentCommand) {
    const post = await this.postRepository.getPostById(dto.postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }

    const user = await this.userRepository.getUserById(dto.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    const newComment = Comment.createInstance({
      content: dto.content,
      postId: dto.postId,
      userId: dto.userId,
    });
    await this.commentsRepository.save(newComment);

    return {
      commentId: newComment.id,
    };
  }
}

export { CreateCommentCommand, CreateCommentUseCase };
