import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';

@Injectable()
class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async save(user: User): Promise<User> {
    return await this.userRepo.save(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async getUserByLoginOrEmail(login: string, email: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: [
        { login, deletedAt: IsNull() },
        { email, deletedAt: IsNull() },
      ],
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }

  async findByConfirmationCode(confirmationCode: string) {
    return await this.userRepo.findOne({
      where: { confirmationCode, deletedAt: IsNull() },
    });
  }

  async findByRecoveryCode(recoveryCode: string) {
    return await this.userRepo.findOne({
      where: { recoveryCode, deletedAt: IsNull() },
    });
  }
}

export { UserRepository };
