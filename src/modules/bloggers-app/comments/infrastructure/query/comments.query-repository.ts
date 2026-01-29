import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { CommentsQueryParams } from '../../api/input-dto/comments.query-params.dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import UserContextDto from 'src/modules/user-account/guards/dto/user.context.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeForCommentsRepository } from '../like-for-comments.repository';

export class CommentsQueryRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly likeForCommentsRepository: LikeForCommentsRepository,
  ) {}

  async findOne(id: string, user: UserContextDto | null): Promise<CommentsViewDto> {
    const commentQuery = `
      SELECT comments.*,
        json_build_object('userId', comments."userId", 'userLogin', comments."userLogin") as "commentatorInfo",
        COUNT(CASE WHEN comment_likes."likeStatus" = 'Like' THEN 1 END) as "likesCount",
        COUNT(CASE WHEN comment_likes."likeStatus" = 'Dislike' THEN 1 END) as "dislikesCount"
       FROM comments 
       LEFT JOIN comment_likes ON comment_likes."commentId" = comments.id 
        AND comment_likes."deletedAt" IS NULL
       WHERE comments.id = $1 AND comments."deletedAt" IS NULL
       GROUP BY comments.id
       `;

    const [comment, status] = await Promise.all([
      this.dataSource.query(commentQuery, [id]),
      user ? this.likeForCommentsRepository.findLikeForComment(id, user.id) : Promise.resolve(null),
    ]);

    if (comment.length === 0) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }

    return CommentsViewDto.mapToView(comment, status ? status.likeStatus : null);
  }

  async findAllbyId(
    postId: string,
    query: CommentsQueryParams,
    user: UserContextDto | null,
  ): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    const conditions: string[] = ['comments."deletedAt" IS NULL'];
    const params: any[] = [];
    let paramIndex = 1;

    conditions.push(`comments."postId" = $${paramIndex}`);
    paramIndex++;
    params.push(postId);

    const sortColumn =
      query.sortBy === 'createdAt'
        ? 'comments."createdAt"'
        : `comments."${query.sortBy}" COLLATE "C"`;

    const commentsQuery = `
      SELECT
        comments.*,
        json_build_object('userId', comments."userId", 'userLogin', comments."userLogin") as "commentatorInfo",
        COUNT(CASE WHEN comment_likes."likeStatus" = 'Like' THEN 1 END) as "likesCount",
        COUNT(CASE WHEN comment_likes."likeStatus" = 'Dislike' THEN 1 END) as "dislikesCount"
      FROM comments
      LEFT JOIN comment_likes ON comment_likes."commentId" = comments.id 
        AND comment_likes."deletedAt" IS NULL
      WHERE ${conditions.join(' AND ')}
      GROUP BY comments.id
      ORDER BY ${sortColumn} ${query.sortDirection}
      OFFSET ${query.calculateSkip()} LIMIT ${query.pageSize}
    `;

    const countQuery = `
    SELECT COUNT(*) as count
    FROM comments
    WHERE ${conditions.join(' AND ')}
  `;

    const likeStatusesQuery = user
      ? `
      SELECT "commentId", "likeStatus"
      FROM comment_likes
      WHERE "userId" = $${paramIndex}
        AND "commentId" IN (
          SELECT id
          FROM comments
          WHERE ${conditions.join(' AND ')}
          ORDER BY ${sortColumn} ${query.sortDirection}
          OFFSET ${query.calculateSkip()} LIMIT ${query.pageSize}
        )
        AND "deletedAt" IS NULL
    `
      : null;

    const [comments, count, likeStatuses] = await Promise.all([
      this.dataSource.query(commentsQuery, params),
      this.dataSource.query(countQuery, params),
      user && likeStatusesQuery
        ? this.dataSource.query(likeStatusesQuery, [...params, user.id])
        : Promise.resolve([]),
    ]);

    const likeStatusesMap = new Map<string, string>();
    if (user && likeStatuses) {
      for (const status of likeStatuses) {
        likeStatusesMap.set(status.commentId, status.likeStatus);
      }
    }

    const items = comments.map((comment: any) => {
      const myStatus = likeStatusesMap.get(comment.id) || null;
      return CommentsViewDto.mapToView([comment], myStatus);
    });

    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: Number(count[0].count),
    });
  }
}
