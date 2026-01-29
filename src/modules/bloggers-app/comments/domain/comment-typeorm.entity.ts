class CommentTypeORM {
  id: string;
  userId: string;
  userLogin: string;
  content: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

class ToCommentEntity {
  static mapToEntity(comment: any[]): CommentTypeORM {
    return {
      id: comment[0].id,
      userId: comment[0].userId,
      userLogin: comment[0].userLogin,
      content: comment[0].content,
      postId: comment[0].postId,
      commentatorInfo: {
        userId: comment[0].userId,
        userLogin: comment[0].userLogin,
      },
      deletedAt: comment[0].deletedAt,
      createdAt: comment[0].createdAt,
      updatedAt: comment[0].updatedAt,
    };
  }
}

export { CommentTypeORM, ToCommentEntity };
