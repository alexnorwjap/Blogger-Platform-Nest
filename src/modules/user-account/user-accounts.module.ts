import { Module } from '@nestjs/common';
import { User } from './domain/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './domain/user.entity';
import { UserService } from './application/user.service';
import { UserController } from './api/user.controller';
import { UserRepository } from './infrastructure/user.repository';
import { UserQueryRepository } from './infrastructure/query/user.query-repository';
import { AuthController } from './api/auth.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { CryptoService } from './application/crypto.service';
import { AuthService } from './application/auth.service';
import { JwtStrategy } from './guards/bearer/jst.strategy';
import { BasicStrategy } from './guards/basic/basic.strategy';
import { LocalStrategy } from './guards/local/local.strategy';
import { RegistrationUseCase } from './application/usecases/auth/registration.usecase';
import { CheckAndCreateUseCase } from './application/usecases/shared/check-create-user.usecase';
import { CreateUserForAdminUseCase } from './application/usecases/admin/create-user-for-admin.usecase';
import { EmailResendingUseCase } from './application/usecases/auth/email-resending.usecase';
import { RegistrationConfirmationUseCase } from './application/usecases/auth/registration-confirm.usecase';
import { PasswordRecoveryCodeUseCase } from './application/usecases/auth/password-recovery-code.usecase';
import { PasswordRecoveryUseCase } from './application/usecases/auth/password-recovery.usecase';
import { LoginUseCase } from './application/usecases/auth/login.usecase';
import { DeleteUserForAdminUseCase } from './application/usecases/admin/delete-user-for-admin.usecase';
import { GetUserByIdQueryHandler } from './application/queries/user/getUserById.query';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from './constants/auth-tokens.inject-constants';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from './constants/auth-tokens.inject-constants';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
  ],
  controllers: [UserController, AuthController],
  providers: [
    // User
    UserService,
    UserRepository,
    UserQueryRepository,
    // Auth
    AuthService,
    //Another
    CryptoService,
    // Strategy
    JwtStrategy,
    BasicStrategy,
    LocalStrategy,
    // useCases
    RegistrationUseCase,
    CheckAndCreateUseCase,
    CreateUserForAdminUseCase,
    EmailResendingUseCase,
    RegistrationConfirmationUseCase,
    PasswordRecoveryCodeUseCase,
    PasswordRecoveryUseCase,
    LoginUseCase,
    DeleteUserForAdminUseCase,

    GetUserByIdQueryHandler,

    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (configService: ConfigService): JwtService => {
        return new JwtService({
          secret: configService.get<string>('JWT_SECRET_ACCESS'),
          signOptions: { expiresIn: '5m' },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (configService: ConfigService): JwtService => {
        return new JwtService({
          secret: configService.get<string>('JWT_SECRET_REFRESH'),
          signOptions: { expiresIn: '20m' },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [JwtStrategy, BasicStrategy, GetUserByIdQueryHandler],
})
export class UserAccountsModule {}
