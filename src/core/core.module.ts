import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreConfig } from './config/core.config';
import { DatabaseService } from './database/database.service';

@Global()
@Module({
  imports: [CqrsModule],
  exports: [CoreConfig, CqrsModule],
  providers: [CoreConfig, DatabaseService],
})
export class CoreModule {}
