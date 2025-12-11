import type { BlogDocument, BlogModelType } from '../domain/blog.entity';
import { Injectable } from '@nestjs/common';
import { Blog } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}
  async save(blog: BlogDocument) {
    return await blog.save();
  }
  async getBlogById(id: string): Promise<BlogDocument | null> {
    return await this.BlogModel.findOne({ _id: id, deletedAt: null });
  }
}
