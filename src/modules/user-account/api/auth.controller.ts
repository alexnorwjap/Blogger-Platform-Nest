import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { RegistrationDto } from './input-dto/registration.req-body.dto';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('registration')
  @HttpCode(204)
  registration(@Body() dto: RegistrationDto) {
    return dto;
  }
}
