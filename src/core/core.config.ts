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
  mongoURI: string;

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

  isSwaggerEnabled: boolean;
  isTestingEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.port = Number(this.configService.get('PORT'));
    this.mongoURI = this.configService.get('MONGO_URL') || '';
    this.env = this.configService.get('NODE_ENV') || '';
    this.accessTokenSecret = this.configService.get('JWT_SECRET_ACCESS') || '';
    this.refreshTokenSecret =
      this.configService.get('JWT_SECRET_REFRESH') || '';
    this.emailPassword = this.configService.get('EMAIL_PASSWORD') || '';
    this.emailUser = this.configService.get('EMAIL_USER') || '';
    this.adminName = this.configService.get('ADMIN_USERNAME') || '';
    this.adminPassword = this.configService.get('ADMIN_PASSWORD') || '';
    this.accessExpireIn =
      this.configService.get('ACCESS_TOKEN_EXPIRE_IN') || '10s';
    this.refreshExpireIn =
      this.configService.get('REFRESH_TOKEN_EXPIRE_IN') || '20s';
    this.isSwaggerEnabled = this.configService.get('IS_SWAGGER') === 'true';
    this.isTestingEnabled = this.configService.get('IS_TESTING') === 'true';

    const errors = validateSync(this);

    if (errors.length > 0) {
      const sortedMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new Error('Validation failed: ' + sortedMessages);
    }
  }
}
