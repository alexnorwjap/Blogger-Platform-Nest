import { BaseQueryParams } from 'src/core/dto/base.query-params';

enum SortBy {
  CreatedAt = 'createdAt',
}

export class CommentsQueryParams extends BaseQueryParams {
  sortBy: SortBy = SortBy.CreatedAt;
}
