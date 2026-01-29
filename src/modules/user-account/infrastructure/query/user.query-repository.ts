import { UserViewDto } from '../../api/view-dto/user.view-dto';
import { UserQueryParams } from '../../api/input-dto/user.query-params.dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { Injectable } from '@nestjs/common';
import { MeViewDto } from '../../api/view-dto/me.view-dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserTypeORM } from '../../domain/user-typeorm.entity';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async findOne(id: string): Promise<UserViewDto | null> {
    const user: UserTypeORM[] = await this.dataSource.query(
      `SELECT * FROM users WHERE id = $1 AND "deletedAt" IS NULL`,
      [id],
    );
    if (user.length === 0) return null;
    return UserViewDto.mapToView(user[0]);
  }

  async findAll(
    query: UserQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const conditions: string[] = ['"deletedAt" IS NULL'];
    const params: any[] = [];
    let paramIndex = 1;

    const searchConditions: string[] = [];

    if (query.searchLoginTerm) {
      searchConditions.push(`"login" ILIKE $${paramIndex}`);
      paramIndex++;
      params.push(`%${query.searchLoginTerm}%`);
    }
    if (query.searchEmailTerm) {
      searchConditions.push(`"email" ILIKE $${paramIndex}`);
      paramIndex++;
      params.push(`%${query.searchEmailTerm}%`);
    }

    if (searchConditions.length > 0) {
      conditions.push(`(${searchConditions.join(' OR ')})`);
    }

    // Разобраться что это за хрень, но сработала
    const sortColumn =
      query.sortBy === 'createdAt'
        ? '"createdAt"'
        : `"${query.sortBy}" COLLATE "C"`;

    const usersQuery = `
    SELECT * FROM users 
    WHERE ${conditions.join(' AND ')}
    ORDER BY ${sortColumn} ${query.sortDirection}
    OFFSET ${query.calculateSkip()} LIMIT ${query.pageSize}
  `;

    const countQuery = `
    SELECT COUNT(*) as count FROM users 
    WHERE ${conditions.join(' AND ')}
    `;

    const [users, count] = await Promise.all([
      this.dataSource.query(usersQuery, params),
      this.dataSource.query(countQuery, params),
    ]);

    return PaginatedViewDto.mapToView({
      items: users.map((user: UserTypeORM) => UserViewDto.mapToView(user)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: Number(count[0].count),
    });
  }

  async getMe(id: string): Promise<MeViewDto | null> {
    const user: UserTypeORM[] = await this.dataSource.query(
      `SELECT * FROM users WHERE id = $1 AND "deletedAt" IS NULL`,
      [id],
    );
    if (user.length === 0) return null;

    return MeViewDto.mapToView(user[0]);
  }
}
