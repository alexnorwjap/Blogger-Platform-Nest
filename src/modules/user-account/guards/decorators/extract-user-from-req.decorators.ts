import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import UserContextDto from '../dto/user.context.dto';

const ExtractUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserContextDto | null => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);

export default ExtractUserFromRequest;
