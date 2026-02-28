import { IsEnum } from 'class-validator';
import { IsStringTrim } from '../../core/decorators/validation/is-string-trim';

enum LikeStatusEnum {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

class UpdateLikeInputDto {
  @IsStringTrim()
  @IsEnum(LikeStatusEnum)
  likeStatus: string;
}

export { UpdateLikeInputDto, LikeStatusEnum };
