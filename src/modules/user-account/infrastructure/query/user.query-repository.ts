import { InjectModel } from '@nestjs/mongoose';
import type { UserModelType } from '../../domain/user.entity';
import { User } from '../../domain/user.entity';
import { UserViewDto } from '../../api/view-dto/user.view-dto';
import { UserQueryParams } from '../../api/input-dto/user.query-params.dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { Injectable } from '@nestjs/common';
import { MeViewDto } from '../../api/view-dto/me.view-dto';

type UserFilter = {
  deletedAt: Date | null;
  $or?: {
    login?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }[];
};

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModelType,
  ) {}
  async findOne(id: string): Promise<UserViewDto | null> {
    const user = await this.userModel.findOne({ _id: id, deletedAt: null });
    if (!user) return null;
    return UserViewDto.mapToView(user);
  }

  async findAll(
    query: UserQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const filter: UserFilter = {
      deletedAt: null,
    };
    if (query.searchLoginTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        login: { $regex: query.searchLoginTerm, $options: 'i' },
      });
    }
    if (query.searchEmailTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        email: { $regex: query.searchEmailTerm, $options: 'i' },
      });
    }

    const usersResult = this.userModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = this.userModel.countDocuments(filter);

    const [users, count] = await Promise.all([usersResult, totalCount]);
    return PaginatedViewDto.mapToView({
      items: users.map((user) => UserViewDto.mapToView(user)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: count,
    });
  }

  async getMe(id: string): Promise<MeViewDto | null> {
    const user = await this.userModel.findOne({ _id: id, deletedAt: null });
    if (!user) return null;
    return MeViewDto.mapToView(user);
  }
}
