import { IsUUID } from 'class-validator';

export class IdInputUUIDDTO {
  @IsUUID()
  id: string;
}

export class PostIdInputUUIDDTO {
  @IsUUID()
  postId: string;
}
