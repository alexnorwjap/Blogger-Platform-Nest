import { BaseQueryParams } from 'src/core/dto/base.query-params';

enum SortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

export class UserQueryParams extends BaseQueryParams {
  sortBy: SortBy = SortBy.CreatedAt;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
}
