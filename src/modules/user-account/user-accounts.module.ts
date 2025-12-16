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
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    UserRepository,
    UserQueryRepository,
    AuthService,
    CryptoService,
    JwtStrategy,
    BasicStrategy,
    LocalStrategy,
  ],
  exports: [JwtStrategy, BasicStrategy],
})
export class UserAccountsModule {}
