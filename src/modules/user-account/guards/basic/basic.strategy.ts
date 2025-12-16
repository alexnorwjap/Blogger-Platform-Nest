import { BasicStrategy as Strategy } from 'passport-http';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  private readonly validUsername = process.env.ADMIN_USERNAME;
  private readonly validPassword = process.env.ADMIN_PASSWORD;
  constructor() {
    super();
  }

  validate(username: string, password: string) {
    if (username !== this.validUsername || password !== this.validPassword) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
      });
    }

    return { username };
  }
}
