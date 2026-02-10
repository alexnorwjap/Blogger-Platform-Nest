import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CoreConfig } from './core.config';

export function getTypeOrmConfig(coreConfig: CoreConfig): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: coreConfig.postgresHost,
    port: coreConfig.postgresPort,
    username: coreConfig.postgresUsername,
    password: coreConfig.postgresPassword,
    database: coreConfig.postgresDatabase,
    autoLoadEntities: true,
    synchronize: true,
  };
}
