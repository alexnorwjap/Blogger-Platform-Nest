import { IsStringTrim } from 'src/core/decorators/validation/is-string-trim';
import { IsStringLengthTrim } from 'src/core/decorators/validation/is-string-length-trim';
import { passwordConstraints } from '../../domain/user.entity';

class NewPasswordDto {
  @IsStringLengthTrim(
    passwordConstraints.minLength,
    passwordConstraints.maxLength,
  )
  newPassword: string;
  @IsStringTrim()
  recoveryCode: string;
}

export { NewPasswordDto };
