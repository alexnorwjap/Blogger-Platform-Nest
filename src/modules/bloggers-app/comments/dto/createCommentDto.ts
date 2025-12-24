class CreateCommentDto {
  content: string;
  postId: string;
  userId: string;
  userLogin: string;
}

class InputCreateCommentDto {
  content: string;
  postId: string;
  userId: string;
}

export { CreateCommentDto, InputCreateCommentDto };
