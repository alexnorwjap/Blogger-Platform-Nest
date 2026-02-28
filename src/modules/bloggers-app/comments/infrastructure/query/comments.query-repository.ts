import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { CommentsQueryParams } from '../../api/input-dto/comments.query-params.dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import UserContextDto from 'src/modules/user-account/guards/dto/user.context.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeForCommentsRepository } from '../like-for-comments.repository';
import { Comment } from '../../domain/comment.entity';
import { SortBy } from '../../api/input-dto/comments.query-params.dto';
import { CommentLike } from '../../domain/like-for-comment.entity';

export class CommentsQueryRepository {
  constructor(
    private readonly likeForCommentsRepository: LikeForCommentsRepository,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepo: Repository<CommentLike>,
  ) {}

  async findOne(id: string, user: UserContextDto | null): Promise<CommentsViewDto> {
    const { entities, raw } = await this.commentRepo
      .createQueryBuilder('comment')
      .select('comment')
      .addSelect('user.login', 'userLogin')
      .addSelect('COUNT(CASE WHEN likes.likeStatus = :like THEN 1 END)', 'likesCount')
      .addSelect('COUNT(CASE WHEN likes.likeStatus = :dislike THEN 1 END)', 'dislikesCount')
      .leftJoin('comment.user', 'user')
      .leftJoin('comment.likes', 'likes', 'likes.deletedAt IS NULL')
      .where('comment.id = :id', { id })
      .andWhere('comment.deletedAt IS NULL')
      .setParameters({ like: 'Like', dislike: 'Dislike' })
      .groupBy('comment.id')
      .addGroupBy('user.id')
      .addGroupBy('user.login')
      .getRawAndEntities()
      .catch((e) => {
        console.error('findOne error:', e);
        throw e;
      });

    const comment = entities[0];
    const rawComment = raw[0];

    if (!comment) throw new DomainException({ code: DomainExceptionCode.NotFound });

    const status = user
      ? await this.likeForCommentsRepository.findLikeForComment(id, user.id)
      : null;

    return CommentsViewDto.mapToView(
      {
        ...comment,
        userLogin: rawComment.userLogin,
        likesCount: rawComment.likesCount,
        dislikesCount: rawComment.dislikesCount,
      },
      status ? status.likeStatus : null,
    );
  }

  async findAllbyId(
    postId: string,
    query: CommentsQueryParams,
    user: UserContextDto | null,
  ): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    const sortByMap: Record<SortBy, string> = {
      [SortBy.CreatedAt]: 'comment.createdAt',
    };

    const baseQuery = this.commentRepo
      .createQueryBuilder('comment')
      .select('comment')
      .addSelect('user.login', 'userLogin')
      .addSelect('COUNT(CASE WHEN likes.likeStatus = :like THEN 1 END)', 'likesCount')
      .addSelect('COUNT(CASE WHEN likes.likeStatus = :dislike THEN 1 END)', 'dislikesCount')
      .leftJoin('comment.user', 'user')
      .leftJoin('comment.likes', 'likes', 'likes.deletedAt IS NULL')
      .where('comment.deletedAt IS NULL')
      .andWhere('comment.postId = :postId', { postId })
      .setParameters({ like: 'Like', dislike: 'Dislike' })
      .groupBy('comment.id')
      .addGroupBy('user.id')
      .addGroupBy('user.login')
      .orderBy(sortByMap[query.sortBy], query.sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .skip(query.calculateSkip())
      .take(query.pageSize);

    const countQuery = this.commentRepo
      .createQueryBuilder('comment')
      .where('comment.deletedAt IS NULL')
      .andWhere('comment.postId = :postId', { postId });

    const [{ entities, raw }, totalCount] = await Promise.all([
      baseQuery.getRawAndEntities().catch((e) => {
        console.error('baseQuery error:', e);
        throw e;
      }),
      countQuery.getCount().catch((e) => {
        console.error('countQuery error:', e);
        throw e;
      }),
    ]);

    const commentIds = entities.map((c) => c.id);

    const likeStatuses: { commentId: string; likeStatus: string }[] =
      user && commentIds.length > 0
        ? await this.commentLikeRepo
            .createQueryBuilder('cl')
            .select('cl.commentId', 'commentId')
            .addSelect('cl.likeStatus', 'likeStatus')
            .where('cl.commentId IN (:...commentIds)', { commentIds })
            .andWhere('cl.userId = :userId', { userId: user.id })
            .andWhere('cl.deletedAt IS NULL')
            .getRawMany()
            .catch((e) => {
              console.error('status error:', e);
              throw e;
            })
        : [];

    const likeStatusesMap = new Map<string, string>();
    if (user && likeStatuses.length > 0) {
      for (const status of likeStatuses) {
        likeStatusesMap.set(status.commentId, status.likeStatus);
      }
    }

    const items = entities.map((comment, index) => {
      const rawComment = raw[index];
      const myStatus = likeStatusesMap.get(comment.id) ?? null;
      return CommentsViewDto.mapToView(
        {
          ...comment,
          userLogin: rawComment.userLogin,
          likesCount: rawComment.likesCount,
          dislikesCount: rawComment.dislikesCount,
        },
        myStatus,
      );
    });

    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }
}
