import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateLikeForPostDto } from '../dto/create-like-for-post.dto';
import { LikeForPostTypeORM, ToLikeForPostEntity } from '../domain/like-for-post.typeorm.entity';

@Injectable()
export class LikeForPostRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateLikeForPostDto) {
    await this.dataSource.query(
      `INSERT INTO post_likes ("userId", "login", "postId", "likeStatus") VALUES ($1, $2, $3, $4)`,
      [dto.userId, dto.login, dto.postId, dto.likeStatus],
    );
  }

  async update(id: string, updates: Record<string, any>): Promise<void> {
    const conditions = Object.keys(updates)
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');
    const params = Object.values(updates);

    const query = `
    UPDATE post_likes 
    SET ${conditions}, "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = $${params.length + 1}
  `;

    await this.dataSource.query(query, [...params, id]);
  }

  async findLikeForPost(postId: string, userId: string): Promise<LikeForPostTypeORM | null> {
    const result: any[] = await this.dataSource.query(
      `SELECT * FROM post_likes WHERE "postId" = $1 AND "userId" = $2 AND "deletedAt" IS NULL`,
      [postId, userId],
    );
    return result.length > 0 ? ToLikeForPostEntity.mapToEntity(result) : null;
  }
}
