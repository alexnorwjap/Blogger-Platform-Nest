export const PostSchema = `
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        "shortDescription" VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        "blogId" UUID NOT NULL,
        "blogName" VARCHAR(255) NOT NULL,
        "deletedAt" TIMESTAMP NULL DEFAULT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("blogId") REFERENCES blogs(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_posts_blog_id ON posts("blogId");
      CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON posts("deletedAt");
      CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts("createdAt");
`;

export const PostLikesSchema = `
      CREATE TABLE IF NOT EXISTS post_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "postId" UUID NOT NULL,
        "userId" UUID NOT NULL,
        login VARCHAR(10) NOT NULL,
        "likeStatus" VARCHAR(10) NOT NULL CHECK ("likeStatus" IN ('Like', 'Dislike', 'None')),
        "deletedAt" TIMESTAMP NULL DEFAULT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("postId") REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE ("postId", "userId")
      );
      
      CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes("postId");
      CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes("userId");
      CREATE INDEX IF NOT EXISTS idx_post_likes_deleted_at ON post_likes("deletedAt");
      CREATE INDEX IF NOT EXISTS idx_post_likes_status_created ON post_likes("postId", "likeStatus", "createdAt" DESC);
`;
