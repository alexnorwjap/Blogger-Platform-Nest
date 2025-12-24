import { BaseQueryParams } from 'src/core/dto/base.query-params';

enum SortBy {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export class BlogsQueryParams extends BaseQueryParams {
  sortBy: SortBy = SortBy.CreatedAt;
  searchNameTerm: string | null = null;
}
