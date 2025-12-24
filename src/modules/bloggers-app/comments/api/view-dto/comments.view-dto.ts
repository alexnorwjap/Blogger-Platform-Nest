import type {
  CommentDocument,
  CommentatorInfo,
  LikesInfo,
} from '../../domain/comments.entity';

export class CommentsViewDto {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfo;
  createdAt: Date;

  static mapToView(
    comment: CommentDocument,
    myStatus: string | null,
  ): CommentsViewDto {
    const dto = new CommentsViewDto();

    dto.id = comment._id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = comment.commentatorInfo;
    dto.likesInfo = {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: myStatus ? myStatus : 'None',
    };
    dto.createdAt = comment.createdAt;

    return dto;
  }
}
