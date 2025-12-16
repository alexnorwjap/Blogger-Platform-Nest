import { IsStringTrim } from 'src/core/decorators/validation/is-string-trim';

class RegistrationConfirmationDto {
  @IsStringTrim()
  code: string;
}

export { RegistrationConfirmationDto };
