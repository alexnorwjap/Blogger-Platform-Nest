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
import { JwtStrategy } from './guards/bearer/jwt.strategy';
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
import { JwtService } from '@nestjs/jwt';
import { CoreConfig } from 'src/core/core.config';
import { Device, DeviceSchema } from './domain/device.entity';
import { DeviceController } from './api/device.controller';
import { DeviceRepository } from './infrastructure/device.repository';
import { GetDeviceByIdQueryHandler } from './application/queries/device/get-device.unauthorized.query';
import { CreateDeviceUseCase } from './application/usecases/device/create-device.usecase';
import { DeleteDeviceUseCase } from './application/usecases/device/delete-device.usecase';
import { DeleteOtherDevicesUseCase } from './application/usecases/device/delete-other-devices.usecase';
import { UpdateDeviceUseCase } from './application/usecases/device/update-device.usecase';
import { DeviceQueryRepository } from './infrastructure/query/device.query-repository';
import { RefreshJwtStrategy } from './guards/cookie/refresh-jwt.strategy';
import { RefreshTokenUseCase } from './application/usecases/auth/refresh-token.usecase';
import { GetDeviceByIdNotFoundQueryHandler } from './application/queries/device/get-device.not-found.query';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    NotificationsModule,
  ],
  controllers: [UserController, AuthController, DeviceController],
  providers: [
    // User
    UserService,
    UserRepository,
    UserQueryRepository,
    // Auth
    AuthService,
    // Device
    DeviceRepository,
    DeviceQueryRepository,

    //Another
    CryptoService,
    // Strategy
    JwtStrategy,
    BasicStrategy,
    LocalStrategy,
    RefreshJwtStrategy,
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
    RefreshTokenUseCase,

    CreateDeviceUseCase,
    DeleteDeviceUseCase,
    DeleteOtherDevicesUseCase,
    UpdateDeviceUseCase,

    // Queries
    GetUserByIdQueryHandler,
    GetDeviceByIdQueryHandler,
    GetDeviceByIdNotFoundQueryHandler,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (coreConfig: CoreConfig): JwtService => {
        return new JwtService({
          secret: coreConfig.accessTokenSecret,
          signOptions: {
            expiresIn: coreConfig.accessExpireIn as any,
          },
        });
      },
      inject: [CoreConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (coreConfig: CoreConfig): JwtService => {
        return new JwtService({
          secret: coreConfig.refreshTokenSecret,
          signOptions: {
            expiresIn: coreConfig.refreshExpireIn as any,
          },
        });
      },
      inject: [CoreConfig],
    },
  ],
  exports: [JwtStrategy, BasicStrategy, GetUserByIdQueryHandler],
})
export class UserAccountsModule {}
