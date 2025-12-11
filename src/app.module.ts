import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersAppModule } from './modules/bloggers-app/bloggers-app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from './modules/user-account/user-accounts.module';
import { TestingModule } from './modules/testing/testing.module';

@Module({
  imports: [
    BloggersAppModule,
    UserAccountsModule,
    TestingModule,
    MongooseModule.forRoot(
      'mongodb+srv://alexnorwjap_db_user:BVm0JNcHgqbKpI7W@mongodb.sqk15l0.mongodb.net/?retryWrites=true&w=majority&appName=MongoDB',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
