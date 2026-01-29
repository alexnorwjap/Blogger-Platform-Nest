export const BlogSchema = `
      CREATE TABLE IF NOT EXISTS blogs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        "websiteUrl" VARCHAR(255) NOT NULL,
        "isMembership" BOOLEAN NOT NULL DEFAULT false,
        "deletedAt" TIMESTAMP NULL DEFAULT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_blogs_deleted_at ON blogs("deletedAt");
      CREATE INDEX IF NOT EXISTS idx_blogs_name ON blogs(name);
`;
