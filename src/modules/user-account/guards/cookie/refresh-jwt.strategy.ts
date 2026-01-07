import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import RefreshTokenContextDto from '../dto/refresh-token-context.dto';
import { CoreConfig } from 'src/core/core.config';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private coreConfig: CoreConfig) {
    super({
      jwtFromRequest: (req: Request) => req.cookies.refreshToken,
      ignoreExpiration: false,
      secretOrKey: coreConfig.refreshTokenSecret,
    });
  }

  validate(payload: RefreshTokenContextDto): RefreshTokenContextDto {
    return payload;
  }
}
