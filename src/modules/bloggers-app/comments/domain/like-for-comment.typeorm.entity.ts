class LikeForCommentTypeORM {
  id: string;
  userId: string;
  login: string;
  commentId: string;
  likeStatus: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

class ToLikeForCommentEntity {
  static mapToEntity(likeForComment: any[]): LikeForCommentTypeORM {
    return {
      id: likeForComment[0].id,
      userId: likeForComment[0].userId,
      login: likeForComment[0].login,
      commentId: likeForComment[0].commentId,
      likeStatus: likeForComment[0].likeStatus,
      createdAt: likeForComment[0].createdAt,
      updatedAt: likeForComment[0].updatedAt,
      deletedAt: likeForComment[0].deletedAt,
    };
  }
}

export { LikeForCommentTypeORM, ToLikeForCommentEntity };
