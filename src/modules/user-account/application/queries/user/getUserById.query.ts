import { IQueryHandler, QueryHandler, Query } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { UserDocument } from 'src/modules/user-account/domain/user.entity';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';

class GetUserByIdQuery extends Query<UserDocument> {
  constructor(public readonly userId: string) {
    super();
  }
}

@QueryHandler(GetUserByIdQuery)
class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: GetUserByIdQuery) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    return user;
  }
}

export { GetUserByIdQuery, GetUserByIdQueryHandler };
