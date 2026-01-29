import { Injectable } from '@nestjs/common';
import { BlogsQueryParams } from '../../api/input-dto/blogs.query-params.dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { BlogsViewDto } from '../../api/view-dto/blogs.view-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogTypeORM } from '../../domain/blog-typeorm.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: BlogsQueryParams): Promise<PaginatedViewDto<BlogsViewDto[]>> {
    const conditions: string[] = ['"deletedAt" IS NULL'];
    const params: any[] = [];
    let paramIndex = 1;

    if (query.searchNameTerm) {
      conditions.push(`"name" ILIKE $${paramIndex}`);
      paramIndex++;
      params.push(`%${query.searchNameTerm}%`);
    }

    const sortColumn =
      query.sortBy === 'createdAt' ? '"createdAt"' : `"${query.sortBy}" COLLATE "C"`;

    const blogsQuery = `
    SELECT * FROM blogs 
    WHERE ${conditions.join(' AND ')}
    ORDER BY ${sortColumn} ${query.sortDirection}
    OFFSET ${query.calculateSkip()} LIMIT ${query.pageSize}
  `;

    const countQuery = `
  SELECT COUNT(*) as count FROM blogs 
  WHERE ${conditions.join(' AND ')}
  `;

    const [blogs, count] = await Promise.all([
      this.dataSource.query(blogsQuery, params),
      this.dataSource.query(countQuery, params),
    ]);

    const items = blogs.map((blog: BlogTypeORM) => BlogsViewDto.mapToView(blog));

    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: Number(count[0].count),
    });
  }

  async findOne(id: string): Promise<BlogsViewDto> {
    const blog: BlogTypeORM[] = await this.dataSource.query(
      `SELECT * FROM blogs WHERE id = $1 AND "deletedAt" IS NULL`,
      [id],
    );

    if (blog.length === 0)
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });

    return BlogsViewDto.mapToView(blog[0]);
  }
}
