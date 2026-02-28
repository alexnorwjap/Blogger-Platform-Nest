import { Injectable } from '@nestjs/common';
import { BlogsQueryParams } from '../../api/input-dto/blogs.query-params.dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { BlogsViewDto } from '../../api/view-dto/blogs.view-dto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Blog } from '../../domain/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepo: Repository<Blog>,
  ) {}

  async findAll(query: BlogsQueryParams): Promise<PaginatedViewDto<BlogsViewDto[]>> {
    const whereConditions: FindOptionsWhere<Blog>[] = [];

    if (query.searchNameTerm) {
      whereConditions.push({ name: ILike(`%${query.searchNameTerm}%`) });
    }

    const [blogs, totalCount] = await this.blogsRepo.findAndCount({
      where: whereConditions.length ? whereConditions : {},
      order: { [query.sortBy]: query.sortDirection },
      skip: query.calculateSkip(),
      take: query.pageSize,
    });

    return PaginatedViewDto.mapToView({
      items: blogs.map((blog) => BlogsViewDto.mapToView(blog)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async findOne(id: string): Promise<BlogsViewDto> {
    const blog = await this.blogsRepo.findOne({ where: { id } });
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    return BlogsViewDto.mapToView(blog);
  }
}
