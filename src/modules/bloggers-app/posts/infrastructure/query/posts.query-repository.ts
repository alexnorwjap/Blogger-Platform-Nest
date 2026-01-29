import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { PostsQueryParams } from '../../api/input-dto/posts.query-params.dto';
import { Injectable } from '@nestjs/common';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import UserContextDto from 'src/modules/user-account/guards/dto/user.context.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { LikeForPostRepository } from '../like-for-post.repository';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private readonly likeForPostRepository: LikeForPostRepository,
  ) {}

  async findOne(id: string, user: UserContextDto | null): Promise<PostsViewDto | null> {
    const postQuery = `
      SELECT
        posts.*,
        COUNT(CASE WHEN post_likes."likeStatus" = 'Like' THEN 1 END) as "likesCount",
        COUNT(CASE WHEN post_likes."likeStatus" = 'Dislike' THEN 1 END) as "dislikesCount",
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'userId', pl."userId",
                'login', pl.login,
                'addedAt', pl."createdAt"
              ) ORDER BY pl."createdAt" DESC
            )
            FROM (
              SELECT "userId", login, "createdAt"
              FROM post_likes
              WHERE post_likes."postId" = posts.id
                AND post_likes."likeStatus" = 'Like'
                AND post_likes."deletedAt" IS NULL
              ORDER BY post_likes."createdAt" DESC
              LIMIT 3
            ) pl
          ),
          '[]'::json
        ) as "newLikes"
      FROM posts
      LEFT JOIN post_likes ON post_likes."postId" = posts.id
        AND post_likes."deletedAt" IS NULL
      WHERE posts.id = $1 AND posts."deletedAt" IS NULL
      GROUP BY posts.id
    `;

    const [post, status] = await Promise.all([
      this.dataSource.query(postQuery, [id]),
      user ? this.likeForPostRepository.findLikeForPost(id, user.id) : Promise.resolve(null),
    ]);

    if (post.length === 0) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }

    return PostsViewDto.mapToView(post, status ? status.likeStatus : null);
  }

  async findAll(
    blogId: string | null,
    query: PostsQueryParams,
    user: UserContextDto | null,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const conditions: string[] = ['posts."deletedAt" IS NULL'];
    const params: any[] = [];
    let paramIndex = 1;

    if (blogId !== null) {
      conditions.push(`posts."blogId" = $${paramIndex}`);
      paramIndex++;
      params.push(blogId);
    }

    const sortColumn =
      query.sortBy === 'createdAt' ? 'posts."createdAt"' : `posts."${query.sortBy}" COLLATE "C"`;

    const postsQuery = `
        SELECT
          posts.*,
          COUNT(CASE WHEN post_likes."likeStatus" = 'Like' THEN 1 END) as "likesCount",
          COUNT(CASE WHEN post_likes."likeStatus" = 'Dislike' THEN 1 END) as "dislikesCount",
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'userId', pl."userId",
                  'login', pl.login,
                  'addedAt', pl."createdAt"
                ) ORDER BY pl."createdAt" DESC
              )
              FROM (
                SELECT "userId", login, "createdAt"
                FROM post_likes
                WHERE post_likes."postId" = posts.id
                  AND post_likes."likeStatus" = 'Like'
                  AND post_likes."deletedAt" IS NULL
                ORDER BY post_likes."createdAt" DESC
                LIMIT 3
              ) pl
            ),
            '[]'::json
          ) as "newLikes"
        FROM posts
        LEFT JOIN post_likes ON post_likes."postId" = posts.id 
          AND post_likes."deletedAt" IS NULL
        WHERE ${conditions.join(' AND ')}
        GROUP BY posts.id
        ORDER BY ${sortColumn} ${query.sortDirection}
        OFFSET ${query.calculateSkip()} LIMIT ${query.pageSize}
      `;

    const countQuery = `
      SELECT COUNT(*) as count
      FROM posts
      WHERE ${conditions.join(' AND ')}
    `;

    const likeStatusesQuery = user
      ? `
        SELECT "postId", "likeStatus"
        FROM post_likes
        WHERE "userId" = $${paramIndex}
          AND "postId" IN (
            SELECT id
            FROM posts
            WHERE ${conditions.join(' AND ')}
            ORDER BY ${sortColumn} ${query.sortDirection}
            OFFSET ${query.calculateSkip()} LIMIT ${query.pageSize}
          )
          AND "deletedAt" IS NULL
      `
      : null;

    const [posts, count, likeStatuses] = await Promise.all([
      this.dataSource.query(postsQuery, params),
      this.dataSource.query(countQuery, params),
      user && likeStatusesQuery
        ? this.dataSource.query(likeStatusesQuery, [...params, user.id])
        : Promise.resolve([]),
    ]);

    const likeStatusesMap = new Map<string, string>();
    if (user && likeStatuses) {
      for (const status of likeStatuses) {
        likeStatusesMap.set(status.postId, status.likeStatus);
      }
    }

    const items = posts.map((post: any) => {
      const likeStatus = likeStatusesMap.get(post.id) || null;
      return PostsViewDto.mapToView([post], likeStatus);
    });

    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: Number(count[0].count),
    });
  }
}
