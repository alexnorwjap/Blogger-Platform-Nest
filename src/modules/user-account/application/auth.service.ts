import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { UserRepository } from '../infrastructure/user.repository';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(dto: LoginDto) {
    const user = await this.userRepository.getUserByLoginOrEmail(
      dto.loginOrEmail,
      dto.loginOrEmail,
    );
    if (!user) return null;

    const isPasswordCorrect = await this.cryptoService.checkPasswords({
      password: dto.password,
      hash: user.password,
    });
    if (!isPasswordCorrect) return null;

    return user._id.toString();
  }
}
