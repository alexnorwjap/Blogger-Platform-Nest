import { Comment } from '../../domain/comment.entity';

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

  static mapToView(
    comment: Comment & { userLogin: string; likesCount: number; dislikesCount: number },
    myStatus: string | null,
  ): CommentsViewDto {
    const dto = new CommentsViewDto();

    dto.id = comment.id;
    dto.content = comment.content;
    dto.commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    };
    dto.likesInfo = {
      likesCount: Number(comment.likesCount),
      dislikesCount: Number(comment.dislikesCount),
      myStatus: myStatus ? myStatus : 'None',
    };
    dto.createdAt = comment.createdAt;

    return dto;
  }
}
