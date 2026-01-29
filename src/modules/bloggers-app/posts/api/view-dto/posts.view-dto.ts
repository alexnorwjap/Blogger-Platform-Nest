class NewestLikes {
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

  static mapToView(post: any[], likeStatus: string | null): PostsViewDto {
    const newPost = new PostsViewDto();
    newPost.id = post[0].id;
    newPost.title = post[0].title;
    newPost.shortDescription = post[0].shortDescription;
    newPost.content = post[0].content;
    newPost.blogId = post[0].blogId;
    newPost.blogName = post[0].blogName;
    newPost.createdAt = post[0].createdAt;
    newPost.extendedLikesInfo = {
      likesCount: Number(post[0].likesCount),
      dislikesCount: Number(post[0].dislikesCount),
      myStatus: likeStatus || 'None',
      newestLikes: post[0].newLikes,
    };
    return newPost;
  }
}
