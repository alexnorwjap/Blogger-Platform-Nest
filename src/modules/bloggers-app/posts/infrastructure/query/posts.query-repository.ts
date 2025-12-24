import type { PostModelType } from '../../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../domain/post.entity';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { PostsQueryParams } from '../../api/input-dto/posts.query-params.dto';
import { Injectable } from '@nestjs/common';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import {
  LikeForPost,
  LikeForPostDocument,
  type LikeForPostModelType,
} from '../../domain/like-for-post.entity';
import UserContextDto from 'src/modules/user-account/guards/dto/user.context.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(LikeForPost.name)
    private LikeForPostModel: LikeForPostModelType,
  ) {}

  async findOne(
    id: string,
    user: UserContextDto | null,
  ): Promise<PostsViewDto | null> {
    const newestLikes = await this.LikeForPostModel.find({
      postId: id,
      likeStatus: 'Like',
    })
      .sort({ createdAt: -1 })
      .limit(3);

    const myStatus = user
      ? await this.LikeForPostModel.findOne({
          postId: id,
          userId: user.id,
        })
      : null;

    const post = await this.PostModel.findOne({ _id: id, deletedAt: null });
    if (!post)
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });

    return PostsViewDto.mapToView(
      post,
      newestLikes,
      myStatus ? myStatus.likeStatus : null,
    );
  }
  async findAll(
    blogId: string | null,
    query: PostsQueryParams,
    user: UserContextDto | null,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const filter = {
      deletedAt: null,
    };

    if (blogId !== null) {
      filter['blogId'] = blogId;
    }
    const postsResult = this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = this.PostModel.countDocuments(filter);

    const [posts, count] = await Promise.all([postsResult, totalCount]);

    const postsIds = posts.map((post) => post._id.toString());

    const [allNewestLikes, myStatuses] = await Promise.all([
      this.LikeForPostModel.find({
        postId: { $in: postsIds },
        likeStatus: 'Like',
      }).sort({ createdAt: -1 }),
      user
        ? this.LikeForPostModel.find({
            postId: { $in: postsIds },
            userId: user.id,
          })
        : Promise.resolve([]),
    ]);

    const newestLikesMap = new Map<string, LikeForPostDocument[]>();
    for (const like of allNewestLikes) {
      const postId = like.postId;
      if (!newestLikesMap.has(postId)) {
        newestLikesMap.set(postId, []);
      }
      const likes = newestLikesMap.get(postId)!;
      if (likes.length < 3) {
        likes.push(like);
      }
    }
    const myStatusesMap = new Map<string, string>();
    for (const like of myStatuses) {
      const postId = like.postId;
      myStatusesMap.set(postId, like.likeStatus);
    }

    return PaginatedViewDto.mapToView({
      items: posts.map((post) => {
        const postId = post._id.toString();
        return PostsViewDto.mapToView(
          post,
          newestLikesMap.get(postId) || [],
          myStatusesMap.get(postId) || null,
        );
      }),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: count,
    });
  }
}
