class PostTypeORM {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

class ToPostEntity {
  static mapToEntity(post: any[]): PostTypeORM {
    return {
      id: post[0].id,
      title: post[0].title,
      shortDescription: post[0].shortDescription,
      content: post[0].content,
      blogId: post[0].blogId,
      blogName: post[0].blogName,
      deletedAt: post[0].deletedAt,
      createdAt: post[0].createdAt,
      updatedAt: post[0].updatedAt,
    };
  }
}

export { PostTypeORM, ToPostEntity };
