import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateCommentDto } from '../dto/createCommentDto';
import { CommentTypeORM } from '../domain/comment-typeorm.entity';
import { ToCommentEntity } from '../domain/comment-typeorm.entity';

@Injectable()
class CommentsRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async updateComment(id: string, updates: Record<string, any>): Promise<void> {
    const conditions = Object.keys(updates)
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');
    const params = Object.values(updates);

    const query = `
      UPDATE comments 
      SET ${conditions}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $${params.length + 1}
    `;

    await this.dataSource.query(query, [...params, id]);
  }

  async createComment(comment: CreateCommentDto) {
    const result: any[] = await this.dataSource.query(
      `INSERT INTO comments (content, "postId", "userId", "userLogin")
     VALUES ($1, $2, $3, $4)
     RETURNING id
    `,
      [comment.content, comment.postId, comment.userId, comment.userLogin],
    );
    return result[0].id;
  }

  async getCommentById(id: string): Promise<CommentTypeORM | null> {
    const result: any[] = await this.dataSource.query(
      `SELECT * FROM comments WHERE id = $1 AND "deletedAt" IS NULL`,
      [id],
    );
    if (result.length === 0) return null;
    return ToCommentEntity.mapToEntity(result);
  }
}

export { CommentsRepository };
