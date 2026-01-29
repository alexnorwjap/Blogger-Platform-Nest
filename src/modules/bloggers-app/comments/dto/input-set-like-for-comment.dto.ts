class InputSetLikeForCommentDto {
  userId: string;
  commentId: string;
  likeStatus: string;
}

class CreateLikeForCommentDto {
  userId: string;
  login: string;
  commentId: string;
  likeStatus: string;
}

export { InputSetLikeForCommentDto, CreateLikeForCommentDto };
