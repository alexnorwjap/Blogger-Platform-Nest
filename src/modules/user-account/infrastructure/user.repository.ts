import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { DataSource } from 'typeorm';
import { ToUserEntity } from '../domain/user-typeorm.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
class UserRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}
  async createUser(user: CreateUserDto) {
    const result: any[] = await this.dataSource.query(
      ` INSERT INTO users (login, email, password)
         VALUES ($1, $2, $3)
         RETURNING id
      `,
      [user.login, user.email, user.password],
    );
    return result[0].id;
  }

  async updateUser(id: string, updates: Record<string, any>): Promise<void> {
    const conditions = Object.keys(updates)
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');
    const params = Object.values(updates);

    const query = `
      UPDATE users 
      SET ${conditions}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $${params.length + 1}
    `;

    await this.dataSource.query(query, [...params, id]);
  }

  async getUserById(id: string) {
    const result: any[] = await this.dataSource.query(
      `SELECT * FROM users WHERE id = $1 AND "deletedAt" IS NULL`,
      [id],
    );
    if (result.length === 0) return null;
    return ToUserEntity.mapToEntity(result);
  }

  async getUserByLoginOrEmail(login: string, email: string) {
    const result: any[] = await this.dataSource.query(
      `SELECT * FROM users WHERE (login = $1 OR email = $2) AND "deletedAt" IS NULL`,
      [login, email],
    );
    if (result.length === 0) return null;
    return ToUserEntity.mapToEntity(result);
  }

  async getuserByEmail(email: string) {
    const result: any[] = await this.dataSource.query(
      `SELECT * FROM users WHERE email = $1 AND "deletedAt" IS NULL`,
      [email],
    );
    if (result.length === 0) return null;
    return ToUserEntity.mapToEntity(result);
  }

  async findByConfirmationCode(code: string) {
    const result: any[] = await this.dataSource.query(
      `SELECT * FROM users WHERE "confirmationCode" = $1 AND "deletedAt" IS NULL`,
      [code],
    );
    if (result.length === 0) return null;
    return ToUserEntity.mapToEntity(result);
  }

  async findByRecoveryCode(recoveryCode: string) {
    const result: any[] = await this.dataSource.query(
      `SELECT * FROM users WHERE "recoveryCode" = $1 AND "deletedAt" IS NULL`,
      [recoveryCode],
    );
    if (result.length === 0) return null;
    return ToUserEntity.mapToEntity(result);
  }
}

export { UserRepository };
