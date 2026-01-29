import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostTypeORM, ToPostEntity } from '../domain/post-typeorm.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async updatePost(id: string, updates: Record<string, any>): Promise<void> {
    const conditions = Object.keys(updates)
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');
    const params = Object.values(updates);

    const query = `
      UPDATE posts 
      SET ${conditions}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $${params.length + 1}
    `;

    await this.dataSource.query(query, [...params, id]);
  }
  async createPost(dto: CreatePostDto): Promise<string> {
    const result: any[] = await this.dataSource.query(
      `INSERT INTO posts (title, "shortDescription", content, "blogId", "blogName")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id
      `,
      [dto.title, dto.shortDescription, dto.content, dto.blogId, dto.blogName],
    );
    return result[0].id;
  }
  async getPostById(id: string): Promise<PostTypeORM | null> {
    const result: any[] = await this.dataSource.query(
      `SELECT * FROM posts WHERE id = $1 AND "deletedAt" IS NULL`,
      [id],
    );
    if (result.length === 0) return null;
    return ToPostEntity.mapToEntity(result);
  }
}
