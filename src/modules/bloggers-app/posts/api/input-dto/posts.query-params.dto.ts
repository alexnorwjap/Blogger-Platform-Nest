import { BaseQueryParams } from 'src/core/dto/base.query-params';
import { Type } from 'class-transformer';

enum SortBy {
  CreatedAt = 'createdAt',
  Title = 'title',
}

export class PostsQueryParams extends BaseQueryParams {
  @Type(() => String)
  sortBy: SortBy = SortBy.CreatedAt;
}
