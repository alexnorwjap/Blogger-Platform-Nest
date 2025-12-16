import { User } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserRepository } from '../infrastructure/user.repository';
import { Injectable } from '@nestjs/common';
import type { UserModelType } from '../domain/user.entity';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import {
  DomainException,
  Extension,
} from 'src/core/exceptions/domain-exceptions';
import { CryptoService } from './crypto.service';

@Injectable()
class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: UserModelType,
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {}
  async create(dto: CreateUserDto): Promise<string> {
    const user = await this.userRepository.getUserByLoginOrEmail(
      dto.login,
      dto.email,
    );
    if (user) {
      const coincidence = user.login === dto.login ? 'login' : 'email';
      const extension = new Extension(
        `This ${coincidence} not valid`,
        coincidence,
      );
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'errorsMessages',
        extensions: [extension],
      });
    }

    const hashPassword = await this.cryptoService.hashPassword(dto.password);
    const newUser = this.UserModel.createInstance({
      login: dto.login,
      email: dto.email,
      password: hashPassword,
    });
    await this.userRepository.save(newUser);
    return newUser._id.toString();
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    user.delete();
    await this.userRepository.save(user);
  }
}

export { UserService };
