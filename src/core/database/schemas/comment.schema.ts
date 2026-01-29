export const CommentSchema = `
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "postId" UUID NOT NULL,
        "userId" UUID NOT NULL,
        "userLogin" VARCHAR(10) NOT NULL,
        "content" TEXT NOT NULL,
        "deletedAt" TIMESTAMP NULL DEFAULT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("postId") REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments("postId");
      CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments("userId");
      CREATE INDEX IF NOT EXISTS idx_comments_deleted_at ON comments("deletedAt");
      CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments("createdAt");
`;

export const CommentLikesSchema = `
      CREATE TABLE IF NOT EXISTS comment_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "commentId" UUID NOT NULL,
        "userId" UUID NOT NULL,
        login VARCHAR(10) NOT NULL,
        "likeStatus" VARCHAR(10) NOT NULL CHECK ("likeStatus" IN ('Like', 'Dislike', 'None')),
        "deletedAt" TIMESTAMP NULL DEFAULT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("commentId") REFERENCES comments(id) ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE ("commentId", "userId")
      );
      
      CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes("commentId");
      CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes("userId");
      CREATE INDEX IF NOT EXISTS idx_comment_likes_deleted_at ON comment_likes("deletedAt");
      CREATE INDEX IF NOT EXISTS idx_comment_likes_status_created ON comment_likes("commentId", "likeStatus", "createdAt" DESC);
      CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_user_deleted ON comment_likes("commentId", "userId", "deletedAt");
`;
