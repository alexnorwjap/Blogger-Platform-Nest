import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateLikeForCommentDto } from '../dto/input-set-like-for-comment.dto';
import {
  LikeForCommentTypeORM,
  ToLikeForCommentEntity,
} from '../domain/like-for-comment.typeorm.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
class LikeForCommentsRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async update(id: string, updates: Record<string, any>): Promise<void> {
    const conditions = Object.keys(updates)
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');
    const params = Object.values(updates);

    const query = `
      UPDATE comment_likes 
      SET ${conditions}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $${params.length + 1}
    `;

    await this.dataSource.query(query, [...params, id]);
  }

  async create(dto: CreateLikeForCommentDto) {
    // нет необходимости возвращать что либо, т.к. не используется
    await this.dataSource.query(
      `INSERT INTO comment_likes ("userId", login, "commentId", "likeStatus") VALUES ($1, $2, $3, $4)`,
      [dto.userId, dto.login, dto.commentId, dto.likeStatus],
    );
  }

  async findLikeForComment(
    commentId: string,
    userId: string,
  ): Promise<LikeForCommentTypeORM | null> {
    const result: any[] = await this.dataSource.query(
      `SELECT * FROM comment_likes WHERE "commentId" = $1 AND "userId" = $2 AND "deletedAt" IS NULL`,
      [commentId, userId],
    );
    return result.length > 0 ? ToLikeForCommentEntity.mapToEntity(result) : null;
  }
}

export { LikeForCommentsRepository };
