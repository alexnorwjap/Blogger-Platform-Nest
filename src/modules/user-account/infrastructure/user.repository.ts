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
    return await user.save();
  }
  async getUserById(id: string): Promise<UserDocument | null> {
    return await this.UserModel.findOne({ _id: id, deletedAt: null });
  }
}

export { UserRepository };
