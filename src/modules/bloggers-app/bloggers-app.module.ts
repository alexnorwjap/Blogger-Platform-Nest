import { Module } from '@nestjs/common';
import { GetBlogByIdQueryHandler } from './blogs/application/queries/get-blog.query';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { PostsController } from './posts/api/posts.controller';
import { GetPostByIdQueryHandler } from './posts/application/queries/getPostById.query';
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
import { GetCommentByIdQueryHandler } from './comments/application/queries/get-comment.query';
import { SetLikeStatusForPostUseCase } from './posts/application/usecases/set-like-status-for-post.usecase';
import { CreateLikeForPostUseCase } from './posts/application/usecases/create-like-for-post.usecase';
import { UpdateLikeForPostUseCase } from './posts/application/usecases/update-like-for-post.usecase';
import { LikeForPostRepository } from './posts/infrastructure/like-for-post.repository';
import { LikeForCommentsRepository } from './comments/infrastructure/like-for-comments.repository';
import { SetLikeStatusForCommentUseCase } from './comments/application/usecases/set-like-status-for-comment.usecase';
import { CreateLikeForCommentUseCase } from './comments/application/usecases/create-like-for-comment.usecase';
import { UpdateLikeForCommentUseCase } from './comments/application/usecases/update-like-for-comment.usecase';
import { BlogsSaController } from './blogs/api/blogs-sa.controller';
import { GetLikeForPostQueryHandler } from './posts/application/queries/getLikeForPost.query';
import { UserAccountsModule } from '../user-account/user-accounts.module';
@Module({
  imports: [UserAccountsModule],
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

    // queryHandlers
    GetBlogByIdQueryHandler,
    GetPostByIdQueryHandler,
    GetLikeForPostQueryHandler,
    GetCommentByIdQueryHandler,

    // useCases
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostForBlogUseCase,

    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,

    CreateCommentUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,

    SetLikeStatusForPostUseCase,
    CreateLikeForPostUseCase,
    UpdateLikeForPostUseCase,

    SetLikeStatusForCommentUseCase,
    CreateLikeForCommentUseCase,
    UpdateLikeForCommentUseCase,
  ],
  exports: [],
})
export class BloggersAppModule {}
