import { BaseQueryParams } from 'src/core/dto/base.query-params';
import { Type } from 'class-transformer';

export enum SortBy {
  CreatedAt = 'createdAt',
  Title = 'title',
  BlogName = 'blogName',
}

export class PostsQueryParams extends BaseQueryParams {
  @Type(() => String)
  sortBy: SortBy = SortBy.CreatedAt;
}
