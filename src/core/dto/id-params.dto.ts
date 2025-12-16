import { IsMongoId } from 'class-validator';

export class IdInputDTO {
  @IsMongoId()
  id: string;
}
