import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query-repository';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get('id')
  async findOne(@Param('id') id: string) {
    return await this.commentsQueryRepository.findOne(id);
  }
}
