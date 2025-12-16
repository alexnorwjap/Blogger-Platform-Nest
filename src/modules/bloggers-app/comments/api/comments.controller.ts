import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query-repository';
import { IdInputDTO } from 'src/core/dto/id-params.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get('id')
  async findOne(@Param() { id }: IdInputDTO) {
    return await this.commentsQueryRepository.findOne(id);
  }
}
