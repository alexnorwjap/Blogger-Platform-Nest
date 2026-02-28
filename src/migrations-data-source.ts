import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Blog } from '../src/modules/bloggers-app/blogs/domain/blog.entity';
import { Post } from '../src/modules/bloggers-app/posts/domain/post.entity';
import { PostLike } from '../src/modules/bloggers-app/posts/domain/like-for-post.entity';
import { Comment } from '../src/modules/bloggers-app/comments/domain/comment.entity';
import { CommentLike } from '../src/modules/bloggers-app/comments/domain/like-for-comment.entity';
import { User } from '../src/modules/user-account/domain/user.entity';
import { Device } from '../src/modules/user-account/domain/device.entity';

dotenv.config({ path: 'src/env/.env.development' });
dotenv.config({ path: 'src/env/.env.development.local', override: true });

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [Blog, Post, PostLike, Comment, CommentLike, User, Device],
  migrations: ['src/migrations/*.ts'],
});
