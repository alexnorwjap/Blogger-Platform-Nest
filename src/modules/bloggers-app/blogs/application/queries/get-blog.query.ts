import { IQueryHandler, QueryHandler, Query } from '@nestjs/cqrs';
import { BlogDocument } from '../../domain/blog.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';

class GetBlogByIdQuery extends Query<BlogDocument> {
  constructor(public readonly blogId: string) {
    super();
  }
}

@QueryHandler(GetBlogByIdQuery)
class GetBlogByIdQueryHandler implements IQueryHandler<GetBlogByIdQuery> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ blogId }: GetBlogByIdQuery) {
    const blog = await this.blogsRepository.getBlogById(blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    return blog;
  }
}

export { GetBlogByIdQuery, GetBlogByIdQueryHandler };
