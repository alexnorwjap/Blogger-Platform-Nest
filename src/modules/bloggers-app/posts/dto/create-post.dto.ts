class CreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

class CreatePostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

class CreatePostForBlogDto {
  title: string;
  shortDescription: string;
  content: string;
}

export type { CreatePostDto, CreatePostForBlogDto, CreatePostInputDto };
