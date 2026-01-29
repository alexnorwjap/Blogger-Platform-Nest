export class CommentsViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
  createdAt: Date;

  static mapToView(comment: any[], myStatus: string | null): CommentsViewDto {
    const dto = new CommentsViewDto();

    dto.id = comment[0].id;
    dto.content = comment[0].content;
    dto.commentatorInfo = comment[0].commentatorInfo;
    dto.likesInfo = {
      likesCount: Number(comment[0].likesCount),
      dislikesCount: Number(comment[0].dislikesCount),
      myStatus: myStatus ? myStatus : 'None',
    };
    dto.createdAt = comment[0].createdAt;

    return dto;
  }
}
