import { BasicStrategy as Strategy } from 'passport-http';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CoreConfig } from 'src/core/core.config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor(private coreConfig: CoreConfig) {
    super();
  }

  validate(username: string, password: string) {
    if (
      username !== this.coreConfig.adminName ||
      password !== this.coreConfig.adminPassword
    ) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
      });
    }

    return { username };
  }
}
