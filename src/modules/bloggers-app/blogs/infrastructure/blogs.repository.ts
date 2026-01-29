import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { BlogTypeORM, ToBlogEntity } from '../domain/blog-typeorm.entity';
import { CreateBlogDto } from 'src/modules/bloggers-app/blogs/dto/create-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async updateBlog(id: string, updates: Record<string, any>): Promise<void> {
    const conditions = Object.keys(updates)
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');
    const params = Object.values(updates);

    const query = `
      UPDATE blogs 
      SET ${conditions}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $${params.length + 1}
    `;

    await this.dataSource.query(query, [...params, id]);
  }

  async createBlog(dto: CreateBlogDto) {
    const result: any[] = await this.dataSource.query(
      `INSERT INTO blogs (name, description, "websiteUrl")
       VALUES ($1, $2, $3)
       RETURNING id
      `,
      [dto.name, dto.description, dto.websiteUrl],
    );
    return result[0].id;
  }

  async getBlogById(id: string): Promise<BlogTypeORM | null> {
    const result: any[] = await this.dataSource.query(
      `SELECT * FROM blogs WHERE id = $1 AND "deletedAt" IS NULL`,
      [id],
    );
    if (result.length === 0) return null;
    return ToBlogEntity.mapToEntity(result);
  }
}
