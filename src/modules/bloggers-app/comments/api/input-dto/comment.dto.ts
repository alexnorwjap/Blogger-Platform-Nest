import { IsStringLengthTrim } from 'src/core/decorators/validation/is-string-length-trim';

const minLengthContent = 20;
const maxLengthContent = 300;

class InputCommentDto {
  @IsStringLengthTrim(minLengthContent, maxLengthContent)
  content: string;
}

export { InputCommentDto };
