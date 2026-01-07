import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import UserContextDto from '../dto/user.context.dto';
import { CoreConfig } from 'src/core/core.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private coreConfig: CoreConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: coreConfig.accessTokenSecret,
    });
  }

  validate(payload: UserContextDto): UserContextDto {
    return payload;
  }
}
