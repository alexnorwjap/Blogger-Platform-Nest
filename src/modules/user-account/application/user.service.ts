import { User } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserRepository } from '../infrastructure/user.repository';
import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { UserModelType } from '../domain/user.entity';

@Injectable()
class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: UserModelType,
    private readonly userRepository: UserRepository,
  ) {}
  async create(dto: CreateUserDto): Promise<string> {
    const user = this.UserModel.create(dto);
    await this.userRepository.save(user);
    return user._id.toString();
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.delete();
    await this.userRepository.save(user);
    return;
  }
}

export { UserService };
