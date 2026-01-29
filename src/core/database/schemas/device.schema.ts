export const DeviceSchema = `
      CREATE TABLE IF NOT EXISTS devices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ip VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        "lastActiveDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" UUID NOT NULL,
        "deletedAt" TIMESTAMP NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES users(id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices("userId");
      CREATE INDEX IF NOT EXISTS idx_devices_deleted_at ON devices("deletedAt");
`;
