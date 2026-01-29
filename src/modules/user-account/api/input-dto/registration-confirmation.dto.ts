import { IsUUID } from 'class-validator';

class RegistrationConfirmationDto {
  @IsUUID()
  code: string;
}

export { RegistrationConfirmationDto };
