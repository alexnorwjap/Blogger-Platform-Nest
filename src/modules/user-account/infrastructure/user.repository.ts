import { InjectModel } from '@nestjs/mongoose';
import type { UserDocument, UserModelType } from '../domain/user.entity';
import { User } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
class UserRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}
  async save(user: UserDocument) {
    await user.save();
  }
  async getUserById(id: string): Promise<UserDocument | null> {
    return await this.UserModel.findOne({ _id: id, deletedAt: null });
  }
  async getUserByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserDocument | null> {
    return await this.UserModel.findOne({
      $or: [{ login }, { email }],
      deletedAt: null,
    });
  }
  async getuserByEmail(email: string) {
    return await this.UserModel.findOne({ email, deletedAt: null });
  }
  async findByConfirmationCode(code: string) {
    return await this.UserModel.findOne({
      'confirmation.confirmationCode': code,
      deletedAt: null,
    });
  }
  async findByRecoveryCode(recoveryCode: string) {
    return await this.UserModel.findOne({
      recoveryCode: recoveryCode,
      deletedAt: null,
    });
  }
}

export { UserRepository };
