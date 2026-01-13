import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { RegistrationDto } from './input-dto/registration.dto';
import { CustomThrottlerGuard } from 'src/core/throttler/throttler-guard';
import { EmailDto } from './input-dto/email-req-body.dto';
import { RegistrationConfirmationDto } from './input-dto/registration-confirmation.dto';
import { NewPasswordDto } from './input-dto/new-password.dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { UserQueryRepository } from '../infrastructure/query/user.query-repository';
import UserContextDto from '../guards/dto/user.context.dto';
import ExtractUserFromRequest from '../guards/decorators/extract-user-from-req.decorators';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationCommand } from '../application/usecases/auth/registration.usecase';
import { EmailResendingCommand } from '../application/usecases/auth/email-resending.usecase';
import { RegistrationConfirmationCommand } from '../application/usecases/auth/registration-confirm.usecase';
import { PasswordRecoveryCodeCommand } from '../application/usecases/auth/password-recovery-code.usecase';
import { PasswordRecoveryCommand } from '../application/usecases/auth/password-recovery.usecase';
import { LoginCommand } from '../application/usecases/auth/login.usecase';
import { JwtRefreshAuthGuard } from '../guards/cookie/jwt-refresh-auth.guard';
import RefreshTokenContextDto from '../guards/dto/refresh-token-context.dto';
import { DeleteDeviceCommand } from '../application/usecases/device/delete-device.usecase';
import { RefreshTokenCommand } from '../application/usecases/auth/refresh-token.usecase';

@Controller('auth')
@UseGuards(CustomThrottlerGuard)
export class AuthController {
  constructor(
    private readonly userQueryRepository: UserQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  registration(@Body() dto: RegistrationDto) {
    return this.commandBus.execute(new RegistrationCommand(dto));
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  emailResending(@Body() dto: EmailDto) {
    return this.commandBus.execute(new EmailResendingCommand(dto));
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  registrationConfirmation(@Body() dto: RegistrationConfirmationDto) {
    return this.commandBus.execute(new RegistrationConfirmationCommand(dto));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @ExtractUserFromRequest() userContext: UserContextDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const result = await this.commandBus.execute(
      new LoginCommand({
        ip: request.ip || 'unknown',
        title: request.headers['user-agent'] || 'unknown',
        userId: userContext.id,
      }),
    );

    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 20, // 20 minutes
      sameSite: 'strict',
    });

    console.log(result.refreshToken);

    return {
      accessToken: result.accessToken,
    };
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  passwordRecoveryCode(@Body() dto: EmailDto) {
    return this.commandBus.execute(new PasswordRecoveryCodeCommand(dto));
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  passwordRecovery(@Body() dto: NewPasswordDto) {
    return this.commandBus.execute(new PasswordRecoveryCommand(dto));
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  me(@ExtractUserFromRequest() user: UserContextDto) {
    return this.userQueryRepository.getMe(user.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtRefreshAuthGuard)
  logout(@ExtractUserFromRequest() user: RefreshTokenContextDto) {
    return this.commandBus.execute(
      new DeleteDeviceCommand(user, user.deviceId),
    );
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @ExtractUserFromRequest() user: RefreshTokenContextDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.commandBus.execute(new RefreshTokenCommand(user));
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 20, // 20 minutes
      sameSite: 'strict',
    });

    return {
      accessToken: result.accessToken,
    };
  }
}
