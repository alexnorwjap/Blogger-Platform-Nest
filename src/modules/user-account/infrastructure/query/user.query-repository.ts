import { UserViewDto } from '../../api/view-dto/user.view-dto';
import { UserQueryParams } from '../../api/input-dto/user.query-params.dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { Injectable } from '@nestjs/common';
import { MeViewDto } from '../../api/view-dto/me.view-dto';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/user.entity';
import { ILike } from 'typeorm';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async findOne(id: string): Promise<UserViewDto | null> {
    const user = await this.userRepo.findOne({ where: { id, deletedAt: IsNull() } });

    return user ? UserViewDto.mapToView(user) : null;
  }

  async findAll(query: UserQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {
    const baseCondition = { deletedAt: IsNull() };
    const whereConditions: FindOptionsWhere<User>[] = [];

    if (query.searchLoginTerm) {
      whereConditions.push({ ...baseCondition, login: ILike(`%${query.searchLoginTerm}%`) });
    }

    if (query.searchEmailTerm) {
      whereConditions.push({ ...baseCondition, email: ILike(`%${query.searchEmailTerm}%`) });
    }

    if (whereConditions.length === 0) {
      whereConditions.push(baseCondition);
    }

    const [users, totalCount] = await this.userRepo.findAndCount({
      where: whereConditions,
      order: { [query.sortBy]: query.sortDirection },
      skip: query.calculateSkip(),
      take: query.pageSize,
    });

    return PaginatedViewDto.mapToView({
      items: users.map((user) => UserViewDto.mapToView(user)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async getMe(id: string): Promise<MeViewDto | null> {
    const user = await this.userRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!user) return null;

    return MeViewDto.mapToView(user);
  }
}
