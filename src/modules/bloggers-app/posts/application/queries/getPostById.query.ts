import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostTypeORM } from '../../domain/post-typeorm.entity';

class GetPostByIdQuery extends Query<PostTypeORM> {
  constructor(public readonly postId: string) {
    super();
  }
}

@QueryHandler(GetPostByIdQuery)
class GetPostByIdQueryHandler implements IQueryHandler<GetPostByIdQuery> {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({ postId }: GetPostByIdQuery) {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    return post;
  }
}
export { GetPostByIdQuery, GetPostByIdQueryHandler };
