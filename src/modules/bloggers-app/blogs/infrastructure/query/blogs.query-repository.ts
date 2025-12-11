import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../domain/blog.entity';
import type { BlogModelType } from '../../domain/blog.entity';
import { Injectable } from '@nestjs/common';
import { BlogsQueryParams } from '../../api/input-dto/blogs.query-params';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { BlogsViewDto } from '../../api/view-dto/blogs.view-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async findAll(
    query: BlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogsViewDto[]>> {
    const filter = {
      deletedAt: null,
      ...(query.searchNameTerm
        ? { name: { $regex: query.searchNameTerm, $options: 'i' } }
        : {}),
    };

    const queryResult = this.BlogModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);
    const totalCount = this.BlogModel.countDocuments(filter);

    const [blogs, count] = await Promise.all([queryResult, totalCount]);
    const items = blogs.map((blog) => BlogsViewDto.mapToView(blog));
    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: count,
    });
  }

  async findOne(id: string): Promise<BlogsViewDto | null> {
    const blog = await this.BlogModel.findOne({ _id: id, deletedAt: null });
    if (!blog) return null;

    return BlogsViewDto.mapToView(blog);
  }
}
