import { IsStringLengthTrim } from 'src/core/decorators/validation/is-string-length-trim';
import { IsUUID } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

const minLengthTitle = 0;
const maxLengthTitle = 30;
const minLengthShortDescription = 0;
const maxLengthShortDescription = 100;
const minLengthContent = 0;
const maxLengthContent = 1000;

class InputPostReqBodyDto {
  @IsStringLengthTrim(minLengthTitle, maxLengthTitle)
  title: string;
  @IsStringLengthTrim(minLengthShortDescription, maxLengthShortDescription)
  shortDescription: string;
  @IsStringLengthTrim(minLengthContent, maxLengthContent)
  content: string;
  @IsUUID()
  @IsNotEmpty()
  blogId: string;
}

export { InputPostReqBodyDto };
