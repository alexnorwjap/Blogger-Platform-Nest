// import { Injectable } from '@nestjs/common';
// import { CommentsRepository } from '../infrastructure/comments.repository';
// import { DomainException } from 'src/core/exceptions/domain-exceptions';
// import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';

// @Injectable()
// export class CommentsService {
//   constructor(private readonly commentsRepository: CommentsRepository) {}

//   async getCommentById(id: string) {
//     const comment = await this.commentsRepository.getCommentById(id);
//     if (!comment) {
//       throw new DomainException({
//         code: DomainExceptionCode.NotFound,
//       });
//     }
//     return comment;
//   }
// }

import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { CommentDocument } from '../../domain/comments.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';

class GetCommentByIdQuery extends Query<CommentDocument> {
  constructor(public readonly commentId: string) {
    super();
  }
}

@QueryHandler(GetCommentByIdQuery)
class GetCommentByIdQueryHandler implements IQueryHandler<GetCommentByIdQuery> {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute({ commentId }: GetCommentByIdQuery) {
    const comment = await this.commentsRepository.getCommentById(commentId);
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    return comment;
  }
}
export { GetCommentByIdQuery, GetCommentByIdQueryHandler };
