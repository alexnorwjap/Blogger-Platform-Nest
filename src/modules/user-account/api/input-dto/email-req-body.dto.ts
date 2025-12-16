import { IsEmailLengthTrim } from 'src/core/decorators/validation/is-string-email-trim';

class EmailDto {
  @IsEmailLengthTrim()
  email: string;
}

export { EmailDto };
