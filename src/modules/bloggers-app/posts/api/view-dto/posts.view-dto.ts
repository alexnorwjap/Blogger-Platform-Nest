import { LikeForPostDocument } from '../../domain/like-for-post.entity';
import { PostDocument } from '../../domain/post.entity';
import type { ExtendedLikesInfo } from '../../domain/post.entity';

export class PostsViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: ExtendedLikesInfo;

  static mapToView(
    post: PostDocument,
    newestLikes: LikeForPostDocument[],
    myStatus: string | null,
  ): PostsViewDto {
    const dto = new PostsViewDto();

    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;
    dto.extendedLikesInfo = {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: myStatus ? myStatus : 'None',
      newestLikes: newestLikes.map((like) => ({
        addedAt: like.createdAt,
        userId: like.userId,
        login: like.login,
      })),
    };
    return dto;
  }
}
