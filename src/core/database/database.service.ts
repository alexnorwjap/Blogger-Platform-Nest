import { OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BlogSchema } from './schemas/blog.schema';
import { PostSchema, PostLikesSchema } from './schemas/post.schema';
import { CommentSchema, CommentLikesSchema } from './schemas/comment.schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    // если переписываем схему, то нужно удалить таблицы
    await this.dataSource.query(`DROP TABLE IF EXISTS blogs CASCADE;`);
    await this.dataSource.query(`DROP TABLE IF EXISTS posts CASCADE;`);
    await this.dataSource.query(`DROP TABLE IF EXISTS post_likes CASCADE;`);
    await this.dataSource.query(`DROP TABLE IF EXISTS comments CASCADE;`);
    await this.dataSource.query(`DROP TABLE IF EXISTS comment_likes CASCADE;`);

    const schemas = [BlogSchema, PostSchema, PostLikesSchema, CommentSchema, CommentLikesSchema];
    for (const sql of schemas) {
      await this.dataSource.query(sql);
    }
  }
}
