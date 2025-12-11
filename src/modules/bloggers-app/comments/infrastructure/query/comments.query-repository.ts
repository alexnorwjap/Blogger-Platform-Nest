import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../../domain/comments.entity';
import type { CommentModelType } from '../../domain/comments.entity';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { CommentsQueryParams } from '../../api/input-dto/comments.query-params.dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';

export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: CommentModelType,
  ) {}

  async findOne(id: string): Promise<CommentsViewDto | null> {
    const comment = await this.commentModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!comment) return null;
    return CommentsViewDto.mapToView(comment);
  }
  async findAllbyId(
    postId: string,
    query: CommentsQueryParams,
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

    return PaginatedViewDto.mapToView({
      items: comments.map((comment) => CommentsViewDto.mapToView(comment)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: count,
    });
  }
}
