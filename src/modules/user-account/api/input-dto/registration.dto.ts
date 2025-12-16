import { IsStringLengthTrim } from 'src/core/decorators/validation/is-string-length-trim';
import { IsEmailLengthTrim } from 'src/core/decorators/validation/is-string-email-trim';
import {
  loginConstraints,
  passwordConstraints,
} from '../../domain/user.entity';

export class RegistrationDto {
  @IsStringLengthTrim(loginConstraints.minLength, loginConstraints.maxLength)
  login: string;

  @IsEmailLengthTrim()
  email: string;

  @IsStringLengthTrim(
    passwordConstraints.minLength,
    passwordConstraints.maxLength,
  )
  password: string;
}
