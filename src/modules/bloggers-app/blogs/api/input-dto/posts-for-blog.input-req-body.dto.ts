import { IsStringLengthTrim } from 'src/core/decorators/validation/is-string-length-trim';

const minLengthTitle = 0;
const maxLengthTitle = 30;
const minLengthShortDescription = 0;
const maxLengthShortDescription = 100;
const minLengthContent = 0;
const maxLengthContent = 1000;

class InputPostForBlogReqBodyDto {
  @IsStringLengthTrim(minLengthTitle, maxLengthTitle)
  title: string;
  @IsStringLengthTrim(minLengthShortDescription, maxLengthShortDescription)
  shortDescription: string;
  @IsStringLengthTrim(minLengthContent, maxLengthContent)
  content: string;
}

export { InputPostForBlogReqBodyDto };
