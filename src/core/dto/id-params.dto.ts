import { IsMongoId, IsUUID } from 'class-validator';

export class IdInputDTO {
  @IsMongoId()
  id: string;
}

export class IdInputUUIDDTO {
  @IsUUID()
  id: string;
}
