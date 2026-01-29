import { IsStringLengthTrim } from 'src/core/decorators/validation/is-string-length-trim';
import { IsEmailLengthTrim } from 'src/core/decorators/validation/is-string-email-trim';
import { loginConstraints, passwordConstraints } from 'src/core/constants/user.constants';

export class RegistrationDto {
  @IsStringLengthTrim(loginConstraints.minLength, loginConstraints.maxLength)
  login: string;

  @IsEmailLengthTrim()
  email: string;

  @IsStringLengthTrim(passwordConstraints.minLength, passwordConstraints.maxLength)
  password: string;
}
