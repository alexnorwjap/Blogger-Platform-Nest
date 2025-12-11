import { Module } from '@nestjs/common';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsController } from './blogs/api/blogs.controller';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { Post, PostSchema } from './posts/domain/post.entity';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { PostsServiceForBlog } from './posts/application/posts.service-for-blog';
import { Comment, CommentSchema } from './comments/domain/comments.entity';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,

    PostsService,
    PostsServiceForBlog,
    PostsRepository,
    PostsQueryRepository,

    CommentsQueryRepository,
  ],
  exports: [],
})
export class BloggersAppModule {}
