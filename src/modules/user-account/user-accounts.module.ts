import { Module } from '@nestjs/common';
import { User } from './domain/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './domain/user.entity';
import { UserService } from './application/user.service';
import { UserController } from './api/user.controller';
import { UserRepository } from './infrastructure/user.repository';
import { UserQueryRepository } from './infrastructure/query/user.query-repository';
import { AuthController } from './api/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, UserRepository, UserQueryRepository],
  exports: [],
})
export class UserAccountsModule {}
