import type { PostModelType } from '../../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../domain/post.entity';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { PostsQueryParams } from '../../api/input-dto/posts.query-params.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async findOne(id: string): Promise<PostsViewDto | null> {
    const post = await this.PostModel.findOne({ _id: id, deletedAt: null });
    if (!post) return null;
    return PostsViewDto.mapToView(post);
  }
  async findAll(
    blogId: string | null,
    query: PostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const filter = {
      deletedAt: null,
    };
    if (blogId !== null) {
      filter['blogId'] = blogId;
    }
    const postsResult = this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = this.PostModel.countDocuments(filter);

    const [posts, count] = await Promise.all([postsResult, totalCount]);

    return PaginatedViewDto.mapToView({
      items: posts.map((post) => PostsViewDto.mapToView(post)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: count,
    });
  }
}
