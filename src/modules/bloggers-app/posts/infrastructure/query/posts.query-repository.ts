import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { PostsQueryParams } from '../../api/input-dto/posts.query-params.dto';
import { Injectable } from '@nestjs/common';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import UserContextDto from 'src/modules/user-account/guards/dto/user.context.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeForPostRepository } from '../like-for-post.repository';
import { Post } from '../../domain/post.entity';
import { PostLike } from '../../domain/like-for-post.entity';
import { NewestLikes } from '../../api/view-dto/posts.view-dto';
import { SortBy } from 'src/modules/bloggers-app/posts/api/input-dto/posts.query-params.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    private readonly likeForPostRepository: LikeForPostRepository,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postLikeRepo: Repository<PostLike>,
  ) {}

  async findOne(id: string, user: UserContextDto | null): Promise<PostsViewDto | null> {
    const { entities, raw } = await this.postRepo
      .createQueryBuilder('post')
      .select('post')
      .addSelect('blog.name', 'blogName')
      .addSelect('COUNT(CASE WHEN postLikes.likeStatus = :like THEN 1 END)', 'likesCount')
      .addSelect('COUNT(CASE WHEN postLikes.likeStatus = :dislike THEN 1 END)', 'dislikesCount')
      .leftJoin('post.postLikes', 'postLikes', 'postLikes.deletedAt IS NULL')
      .leftJoin('post.blog', 'blog')
      .where('post.id = :id', { id })
      .andWhere('post.deletedAt IS NULL')
      .setParameters({ like: 'Like', dislike: 'Dislike' })
      .groupBy('post.id')
      .addGroupBy('blog.id')
      .addGroupBy('blog.name')
      .getRawAndEntities();

    const post = entities[0];
    const rawPost = raw[0];

    if (!post) throw new DomainException({ code: DomainExceptionCode.NotFound });

    const [newestLikes, myStatus] = await Promise.all([
      this.postRepo.manager
        .getRepository(PostLike)
        .createQueryBuilder('pl')
        .select('pl.userId', 'userId')
        .addSelect('u.login', 'login')
        .addSelect('pl.createdAt', 'addedAt')
        .innerJoin('pl.user', 'u')
        .where('pl.postId = :postId', { postId: id })
        .andWhere('pl.likeStatus = :like', { like: 'Like' })
        .andWhere('pl.deletedAt IS NULL')
        .orderBy('pl.createdAt', 'DESC')
        .limit(3)
        .getRawMany(),
      user ? this.likeForPostRepository.findLikeForPost(id, user.id) : Promise.resolve(null),
    ]);

    return PostsViewDto.mapToView(
      {
        ...post,
        blogName: rawPost.blogName,
        likesCount: rawPost.likesCount,
        dislikesCount: rawPost.dislikesCount,
      } as Post & {
        blogName: string;
        likesCount: number;
        dislikesCount: number;
      },
      myStatus,
      newestLikes as NewestLikes[],
    );
  }

  async findAll(
    blogId: string | null,
    query: PostsQueryParams,
    user: UserContextDto | null,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const sortByMap: Record<SortBy, string> = {
      [SortBy.CreatedAt]: 'post.createdAt',
      [SortBy.Title]: 'post.title',
      [SortBy.BlogName]: 'blog_name',
    };

    const baseQuery = this.postRepo
      .createQueryBuilder('post')
      .select('post')
      .addSelect('blog.name', 'blog_name')
      .addSelect('COUNT(CASE WHEN postLikes.likeStatus = :like THEN 1 END)', 'likesCount')
      .addSelect('COUNT(CASE WHEN postLikes.likeStatus = :dislike THEN 1 END)', 'dislikesCount')
      .leftJoin('post.blog', 'blog')
      .leftJoin('post.postLikes', 'postLikes', 'postLikes.deletedAt IS NULL')
      .where('post.deletedAt IS NULL')
      .setParameters({ like: 'Like', dislike: 'Dislike' })
      .groupBy('post.id')
      .addGroupBy('blog.id')
      .addGroupBy('blog.name')
      .orderBy(sortByMap[query.sortBy], query.sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .skip(query.calculateSkip())
      .take(query.pageSize);

    const countQuery = this.postRepo.createQueryBuilder('post').where('post.deletedAt IS NULL');

    if (blogId !== null) {
      baseQuery.andWhere('post.blogId = :blogId', { blogId });
      countQuery.andWhere('post.blogId = :blogId', { blogId });
    }

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

    const postIds = entities.map((p) => p.id);

    const [newestLikesRaw, likeStatuses]: [
      { postId: string; userId: string; login: string; addedAt: Date }[],
      { postId: string; likeStatus: string }[],
    ] = await Promise.all([
      postIds.length
        ? this.postLikeRepo
            .createQueryBuilder('pl')
            .select('pl.postId', 'postId')
            .addSelect('pl.userId', 'userId')
            .addSelect('u.login', 'login')
            .addSelect('pl.createdAt', 'addedAt')
            .innerJoin('pl.user', 'u')
            .where('pl.postId IN (:...postIds)', { postIds })
            .andWhere('pl.likeStatus = :like', { like: 'Like' })
            .andWhere('pl.deletedAt IS NULL')
            .orderBy('pl.createdAt', 'DESC')
            .getRawMany()
        : Promise.resolve([]),
      user && postIds.length
        ? this.postLikeRepo
            .createQueryBuilder('pl')
            .select('pl.postId', 'postId')
            .addSelect('pl.likeStatus', 'likeStatus')
            .where('pl.postId IN (:...postIds)', { postIds })
            .andWhere('pl.userId = :userId', { userId: user.id })
            .andWhere('pl.deletedAt IS NULL')
            .getRawMany()
        : Promise.resolve([]),
    ]);

    const newestLikesMap = new Map<string, NewestLikes[]>();
    for (const like of newestLikesRaw) {
      const existing = newestLikesMap.get(like.postId) ?? [];
      if (existing.length < 3) {
        newestLikesMap.set(like.postId, [
          ...existing,
          {
            login: like.login,
            userId: like.userId,
            addedAt: like.addedAt,
          },
        ]);
      }
    }

    const likeStatusesMap = new Map<string, string>();
    for (const status of likeStatuses) {
      likeStatusesMap.set(status.postId, status.likeStatus);
    }

    const items = entities.map((post, index) => {
      const rawPost = raw[index];
      const myStatus = likeStatusesMap.get(post.id) ?? null;
      const newestLikes = newestLikesMap.get(post.id) ?? [];

      return PostsViewDto.mapToView(
        {
          ...post,
          blogName: rawPost.blog_name,
          likesCount: rawPost.likesCount,
          dislikesCount: rawPost.dislikesCount,
        } as Post & { blogName: string; likesCount: number; dislikesCount: number },
        myStatus ? ({ likeStatus: myStatus } as PostLike) : null,
        newestLikes,
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
