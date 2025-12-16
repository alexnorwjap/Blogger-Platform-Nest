import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { RegistrationDto } from './input-dto/registration.dto';
import { AuthService } from '../application/auth.service';
import { CustomThrottlerGuard } from 'src/core/throttler/throttler-guard';
import { EmailDto } from './input-dto/email-req-body.dto';
import { RegistrationConfirmationDto } from './input-dto/registration-confirmation.dto';
import type { AccessToken } from './view-dto/acsses-token.view-dto';
import { NewPasswordDto } from './input-dto/new-password.dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { UserQueryRepository } from '../infrastructure/query/user.query-repository';
import UserContextDto from '../guards/dto/user.context.dto';
import ExtractUserFromRequest from '../guards/decorators/extract-user-from-req.decorators';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';

@Controller('auth')
@UseGuards(CustomThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userQueryRepository: UserQueryRepository,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  registration(@Body() dto: RegistrationDto) {
    return this.authService.registration(dto);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  emailResending(@Body() dto: EmailDto) {
    return this.authService.emailResending(dto);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  registrationConfirmation(@Body() dto: RegistrationConfirmationDto) {
    return this.authService.registrationConfirmation(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@ExtractUserFromRequest() user: UserContextDto): AccessToken {
    return this.authService.login(user);
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  passwordRecoveryCode(@Body() dto: EmailDto) {
    return this.authService.passwordRecoveryCode(dto);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  passwordRecovery(@Body() dto: NewPasswordDto) {
    return this.authService.passwordRecovery(dto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  me(@ExtractUserFromRequest() user: UserContextDto) {
    return this.userQueryRepository.getMe(user.id);
  }
}
