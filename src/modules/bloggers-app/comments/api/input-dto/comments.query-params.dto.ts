import { BaseQueryParams } from 'src/core/dto/base.query-params';

export enum SortBy {
  CreatedAt = 'createdAt',
}

export class CommentsQueryParams extends BaseQueryParams {
  sortBy: SortBy = SortBy.CreatedAt;
}
