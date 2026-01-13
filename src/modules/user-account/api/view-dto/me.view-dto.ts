import { UserTypeORM } from '../../domain/user-typeorm.entity';

export class MeViewDto {
  userId: string;
  login: string;
  email: string;

  static mapToView(user: UserTypeORM): MeViewDto {
    const dto = new MeViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.userId = user.id;

    return dto;
  }
}
