import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import UserContextDto from '../dto/user.context.dto';
import RefreshTokenContextDto from '../dto/refresh-token-context.dto';

const ExtractUserFromRequest = createParamDecorator(
  (
    data: unknown,
    context: ExecutionContext,
  ): UserContextDto | RefreshTokenContextDto | null => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);

export default ExtractUserFromRequest;
