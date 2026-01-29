import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
// import { DomainException } from 'src/core/exceptions/domain-exceptions';
// import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { LikeForPostRepository } from '../../infrastructure/like-for-post.repository';
import { LikeForPostTypeORM } from '../../domain/like-for-post.typeorm.entity';

class GetLikeForPostQuery extends Query<LikeForPostTypeORM | null> {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
  ) {
    super();
  }
}

@QueryHandler(GetLikeForPostQuery)
class GetLikeForPostQueryHandler implements IQueryHandler<GetLikeForPostQuery> {
  constructor(private readonly likeForPostRepository: LikeForPostRepository) {}

  async execute({ postId, userId }: GetLikeForPostQuery) {
    const likeForPost = await this.likeForPostRepository.findLikeForPost(postId, userId);
    // if (!likeForPost) {
    //   throw new DomainException({
    //     code: DomainExceptionCode.NotFound,
    //   });
    // }
    return likeForPost;
  }
}
export { GetLikeForPostQuery, GetLikeForPostQueryHandler };
