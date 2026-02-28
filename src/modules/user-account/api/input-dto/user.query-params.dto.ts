import { BaseQueryParams } from 'src/core/dto/base.query-params';
import { IsOptional } from 'class-validator';

export enum SortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

export class UserQueryParams extends BaseQueryParams {
  @IsOptional()
  sortBy: SortBy = SortBy.CreatedAt;
  @IsOptional()
  searchLoginTerm: string | null = null;
  @IsOptional()
  searchEmailTerm: string | null = null;
}
