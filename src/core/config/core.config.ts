import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, validateSync, IsEnum, IsNumber } from 'class-validator';

enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

@Injectable()
export class CoreConfig {
  @IsNotEmpty()
  @IsNumber()
  port: number;

  @IsNotEmpty()
  @IsEnum(Environments)
  env: string;

  @IsNotEmpty()
  accessTokenSecret: string;

  @IsNotEmpty()
  refreshTokenSecret: string;

  @IsNotEmpty()
  emailPassword: string;

  @IsNotEmpty()
  emailUser: string;

  @IsNotEmpty()
  adminName: string;

  @IsNotEmpty()
  adminPassword: string;

  @IsNotEmpty()
  accessExpireIn: string;

  @IsNotEmpty()
  refreshExpireIn: string;

  @IsNotEmpty()
  postgresHost: string;

  @IsNotEmpty()
  postgresPort: number;

  @IsNotEmpty()
  postgresUsername: string;

  @IsNotEmpty()
  postgresPassword: string;

  @IsNotEmpty()
  postgresDatabase: string;

  isSwaggerEnabled: boolean;
  isTestingEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.port = Number(this.configService.getOrThrow('PORT'));
    this.env = this.configService.getOrThrow('NODE_ENV');
    this.accessTokenSecret = this.configService.getOrThrow('JWT_SECRET_ACCESS');
    this.refreshTokenSecret = this.configService.getOrThrow('JWT_SECRET_REFRESH');
    this.emailPassword = this.configService.getOrThrow('EMAIL_PASSWORD');
    this.emailUser = this.configService.getOrThrow('EMAIL_USER');
    this.adminName = this.configService.getOrThrow('ADMIN_USERNAME');
    this.adminPassword = this.configService.getOrThrow('ADMIN_PASSWORD');
    this.accessExpireIn = this.configService.getOrThrow('ACCESS_TOKEN_EXPIRE_IN');
    this.refreshExpireIn = this.configService.getOrThrow('REFRESH_TOKEN_EXPIRE_IN');
    this.isSwaggerEnabled = Boolean(this.configService.getOrThrow('IS_SWAGGER'));
    this.isTestingEnabled = Boolean(this.configService.getOrThrow('IS_TESTING'));

    this.postgresHost = this.configService.getOrThrow('POSTGRES_HOST');
    this.postgresPort = Number(this.configService.getOrThrow('POSTGRES_PORT'));
    this.postgresUsername = this.configService.getOrThrow('POSTGRES_USERNAME');
    this.postgresPassword = this.configService.getOrThrow('POSTGRES_PASSWORD');
    this.postgresDatabase = this.configService.getOrThrow('POSTGRES_DATABASE');

    const errors = validateSync(this);

    if (errors.length > 0) {
      const sortedMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new Error('Validation failed: ' + sortedMessages);
    }
  }
}
