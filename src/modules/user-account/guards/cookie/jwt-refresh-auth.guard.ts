import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { DeviceRepository } from '../../infrastructure/device.repository';
import { isAfter } from 'date-fns';
import RefreshTokenContextDto from '../dto/refresh-token-context.dto';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private readonly reflector: Reflector,
    private readonly deviceRepository: DeviceRepository,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    const user = request.user as RefreshTokenContextDto;
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
      });
    }
    const device = await this.deviceRepository.getDeviceById(user.deviceId);
    if (!device) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
      });
    }
    const tokenLastDate = new Date(user.lastActiveDate);
    const tokenFromDB = new Date(device.lastActiveDate);

    const isTokenExpired = isAfter(tokenFromDB, tokenLastDate);
    if (isTokenExpired) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
      });
    }

    return true;
  }

  handleRequest(err: any, user: any) {
    if (err) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
      });
    }

    return user;
  }
}
