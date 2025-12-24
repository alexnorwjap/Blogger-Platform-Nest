import { IsStringLengthTrim } from 'src/core/decorators/validation/is-string-length-trim';
import { Matches } from 'class-validator';

const minLengthName = 0;
const maxLengthName = 15;

const minLengthDescription = 0;
const maxLengthDescription = 500;

const minLengthWebsiteUrl = 0;
const maxLengthWebsiteUrl = 100;

const URL_PATTERN =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

class InputBlogReqBodyDto {
  @IsStringLengthTrim(minLengthName, maxLengthName)
  name: string;
  @IsStringLengthTrim(minLengthDescription, maxLengthDescription)
  description: string;
  @Matches(URL_PATTERN, { message: 'websiteUrl incorrect' })
  @IsStringLengthTrim(minLengthWebsiteUrl, maxLengthWebsiteUrl)
  websiteUrl: string;
}
export { InputBlogReqBodyDto };
