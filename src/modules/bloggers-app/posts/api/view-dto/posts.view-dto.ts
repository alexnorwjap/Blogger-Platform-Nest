import { Post } from '../../domain/post.entity';
import { PostLike } from '../../domain/like-for-post.entity';

export class NewestLikes {
  addedAt: Date;
  userId: string;
  login: string;
}

class ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikes[];
}

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
    post: Post & { blogName: string; likesCount: number; dislikesCount: number },
    myStatus: PostLike | null,
    newestLikes: NewestLikes[],
  ): PostsViewDto {
    const newPost = new PostsViewDto();
    newPost.id = post.id;
    newPost.title = post.title;
    newPost.shortDescription = post.shortDescription;
    newPost.content = post.content;
    newPost.blogId = post.blogId;
    newPost.blogName = post.blogName;
    newPost.createdAt = post.createdAt;
    newPost.extendedLikesInfo = {
      likesCount: Number(post.likesCount),
      dislikesCount: Number(post.dislikesCount),
      myStatus: myStatus ? myStatus.likeStatus : 'None',
      newestLikes: newestLikes,
    };
    return newPost;
  }
}
