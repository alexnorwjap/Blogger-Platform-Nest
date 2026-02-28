import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { PostsController } from './posts/api/posts.controller';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query-repository';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { UpdateBlogUseCase } from './blogs/application/usecases/update-blog.usecase';
import { DeleteBlogUseCase } from './blogs/application/usecases/delete-blog.usecase';
import { CreatePostUseCase } from './posts/application/usecases/create-post.usecase';
import { UpdatePostUseCase } from './posts/application/usecases/update-post.usecase';
import { DeletePostUseCase } from './posts/application/usecases/delete-post.usecase';
import { CreatePostForBlogUseCase } from './blogs/application/usecases/create-post-for-blog.usecase';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CreateCommentUseCase } from './comments/application/usecases/create-comment.usecase';
import { UpdateCommentUseCase } from './comments/application/usecases/update-comment.usecase';
import { DeleteCommentUseCase } from './comments/application/usecases/delete-comment.usecase';
import { SetLikeStatusForPostUseCase } from './posts/application/usecases/set-like-status-for-post.usecase';
import { CreateLikeForPostUseCase } from './posts/application/usecases/create-like-for-post.usecase';
import { LikeForPostRepository } from './posts/infrastructure/like-for-post.repository';
import { LikeForCommentsRepository } from './comments/infrastructure/like-for-comments.repository';
import { SetLikeStatusForCommentUseCase } from './comments/application/usecases/set-like-status-for-comment.usecase';
import { CreateLikeForCommentUseCase } from './comments/application/usecases/create-like-for-comment.usecase';
import { BlogsSaController } from './blogs/api/blogs-sa.controller';
import { GetLikeForPostUseCase } from './posts/application/usecases/getLikeForPost.usecase';
import { UserAccountsModule } from '../user-account/user-accounts.module';
import { Blog } from './blogs/domain/blog.entity';
import { Post } from './posts/domain/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetBlogByIdUseCase } from './blogs/application/usecases/get-blog.usecase';
import { PostLike } from './posts/domain/like-for-post.entity';
import { Comment } from './comments/domain/comment.entity';
import { CommentLike } from './comments/domain/like-for-comment.entity';
import { GetCommentByIdUseCase } from './comments/application/usecases/get-comment.usecase';
@Module({
  imports: [
    UserAccountsModule,
    TypeOrmModule.forFeature([Blog, Post, PostLike, Comment, CommentLike]),
  ],
  controllers: [BlogsController, BlogsSaController, PostsController, CommentsController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,

    PostsRepository,
    PostsQueryRepository,
    LikeForPostRepository,

    CommentsQueryRepository,
    LikeForCommentsRepository,
    CommentsRepository,

    // useCases
    CreateBlogUseCase,
    GetBlogByIdUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostForBlogUseCase,

    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,

    CreateCommentUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    GetCommentByIdUseCase,

    SetLikeStatusForPostUseCase,
    CreateLikeForPostUseCase,
    GetLikeForPostUseCase,

    SetLikeStatusForCommentUseCase,

    CreateLikeForCommentUseCase,
  ],
  exports: [],
})
export class BloggersAppModule {}
