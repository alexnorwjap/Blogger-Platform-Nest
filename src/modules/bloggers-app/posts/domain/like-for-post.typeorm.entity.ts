class LikeForPostTypeORM {
  id: string;
  userId: string;
  login: string;
  postId: string;
  likeStatus: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

class ToLikeForPostEntity {
  static mapToEntity(likeForPost: any[]): LikeForPostTypeORM {
    return {
      id: likeForPost[0].id,
      userId: likeForPost[0].userId,
      login: likeForPost[0].login,
      postId: likeForPost[0].postId,
      likeStatus: likeForPost[0].likeStatus,
      deletedAt: likeForPost[0].deletedAt,
      createdAt: likeForPost[0].createdAt,
      updatedAt: likeForPost[0].updatedAt,
    };
  }
}

export { LikeForPostTypeORM, ToLikeForPostEntity };
