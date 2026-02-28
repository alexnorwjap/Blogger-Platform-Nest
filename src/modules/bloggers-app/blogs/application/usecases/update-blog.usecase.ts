import { UpdateBlogDto } from 'src/modules/bloggers-app/blogs/dto/update-blog.dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';

class UpdateBlogCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ id, dto }: UpdateBlogCommand) {
    const blog = await this.blogsRepository.getBlogById(id);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    await this.blogsRepository.save(blog);
  }
}

export { UpdateBlogCommand, UpdateBlogUseCase };
