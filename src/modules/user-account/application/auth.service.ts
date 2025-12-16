import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { UserRepository } from '../infrastructure/user.repository';
import {
  DomainException,
  Extension,
} from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import type { UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import { EmailService } from 'src/modules/notifications/email.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { EmailDto } from '../dto/email.dto';
import { RegistrationConfirmationDto } from '../dto/registration-confirmation.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { NewPasswordDto } from '../api/input-dto/new-password.dto';
import UserContextDto from '../guards/dto/user.context.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: UserModelType,
    private readonly cryptoService: CryptoService,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
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

  async registration(dto: CreateUserDto) {
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

    this.emailService
      .sendConfirmationEmail(
        newUser.email,
        newUser.confirmation.confirmationCode,
      )
      .catch(console.error);
  }

  async emailResending(dto: EmailDto) {
    const user = await this.userRepository.getuserByEmail(dto.email);
    if (!user || user.isEmailConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'errorsMessages',
        extensions: [new Extension('Email confirmd or not found', 'email')],
      });
    }

    user.resetConfirmationCode();
    await this.userRepository.save(user);

    this.emailService
      .sendConfirmationEmail(user.email, user.confirmation.confirmationCode)
      .catch(console.error);
  }

  async registrationConfirmation(dto: RegistrationConfirmationDto) {
    const user = await this.userRepository.findByConfirmationCode(dto.code);
    if (
      !user ||
      user.isEmailConfirmed ||
      user.confirmation.expirationDate.getTime() < Date.now()
    ) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'errorsMessages',
        extensions: [new Extension('Code not valid or expired', 'code')],
      });
    }

    user.confirmUser();
    await this.userRepository.save(user);
  }

  login(user: UserContextDto) {
    const accessToken = this.jwtService.sign(user);

    return {
      accessToken,
    };
  }

  async passwordRecoveryCode(dto: EmailDto) {
    const user = await this.userRepository.getuserByEmail(dto.email);
    if (!user) return;

    user.setRecoveryCode();
    await this.userRepository.save(user);

    this.emailService
      .sendPasswordRecoveryEmail(user.email, user.recoveryCode)
      .catch(console.error);
  }

  async passwordRecovery(dto: NewPasswordDto) {
    const user = await this.userRepository.findByRecoveryCode(dto.recoveryCode);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'errorsMessages',
        extensions: [new Extension('Invalid recovery code', 'recoveryCode')],
      });
    }
    if (user.recoveryCodeExpirationDate.getTime() < Date.now()) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
      });
    }

    const hashedPassword = await this.cryptoService.hashPassword(
      dto.newPassword,
    );
    user.updatePassword(hashedPassword);

    await this.userRepository.save(user);
  }
}
