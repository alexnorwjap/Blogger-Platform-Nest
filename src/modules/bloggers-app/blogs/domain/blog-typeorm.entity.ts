class BlogTypeORM {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

class ToBlogEntity {
  static mapToEntity(blog: any[]): BlogTypeORM {
    return {
      id: blog[0].id,
      name: blog[0].name,
      description: blog[0].description,
      websiteUrl: blog[0].websiteUrl,
      isMembership: blog[0].isMembership,
      deletedAt: blog[0].deletedAt,
      createdAt: blog[0].createdAt,
      updatedAt: blog[0].updatedAt,
    };
  }
}

export { BlogTypeORM, ToBlogEntity };
