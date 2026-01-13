export const UserSchema = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        login VARCHAR(10) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false,
        "confirmationCode" UUID NOT NULL DEFAULT gen_random_uuid(),
        "confirmationExpirationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '15 minutes',
        "recoveryCode" UUID NULL DEFAULT NULL,
        "recoveryCodeExpirationDate" TIMESTAMP NULL DEFAULT NULL,
        "deletedAt" TIMESTAMP NULL DEFAULT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);
      CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users("deletedAt");
      CREATE INDEX IF NOT EXISTS idx_users_confirmation_code ON users("confirmationCode");
`;
