import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../../domain/comments.entity';
import type { CommentModelType } from '../../domain/comments.entity';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { CommentsQueryParams } from '../../api/input-dto/comments.query-params.dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import UserContextDto from 'src/modules/user-account/guards/dto/user.context.dto';
import {
  LikeForComment,
  type LikeForCommentModelType,
} from '../../domain/like-for-comment.entity';

export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: CommentModelType,
    @InjectModel(LikeForComment.name)
    private readonly likeForCommentModel: LikeForCommentModelType,
  ) {}

  async findOne(
    id: string,
    user: UserContextDto | null,
  ): Promise<CommentsViewDto | null> {
    const myStatus = user
      ? await this.likeForCommentModel.findOne({
          commentId: id,
          userId: user.id,
        })
      : null;
    const comment = await this.commentModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!comment)
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });

    return CommentsViewDto.mapToView(
      comment,
      myStatus ? myStatus.likeStatus : null,
    );
  }

  async findAllbyId(
    postId: string,
    query: CommentsQueryParams,
    user: UserContextDto | null,
  ): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    const commentsResult = this.commentModel
      .find({
        postId,
        deletedAt: null,
      })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = this.commentModel.countDocuments({
      postId,
      deletedAt: null,
    });
    const [comments, count] = await Promise.all([commentsResult, totalCount]);
    const commentIds = comments.map((comment) => comment._id.toString());
    const myStatuses = user
      ? await this.likeForCommentModel
          .find({
            commentId: { $in: commentIds },
            userId: user.id,
          })
          .sort({ createdAt: -1 })
      : null;
    const myStatusesMap = new Map<string, string>();
    for (const like of myStatuses || []) {
      const commentId = like.commentId;
      myStatusesMap.set(commentId, like.likeStatus);
    }
    return PaginatedViewDto.mapToView({
      items: comments.map((comment) => {
        const myStatus = myStatusesMap.get(comment._id.toString()) || null;
        return CommentsViewDto.mapToView(comment, myStatus ? myStatus : null);
      }),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: count,
    });
  }
}
