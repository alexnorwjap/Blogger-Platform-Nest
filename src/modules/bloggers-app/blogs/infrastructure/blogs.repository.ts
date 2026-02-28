import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
  ) {}

  async save(blog: Blog): Promise<Blog> {
    return await this.blogRepo.save(blog);
  }

  async delete(id: string): Promise<void> {
    await this.blogRepo.softDelete(id);
  }

  async getBlogById(id: string): Promise<Blog | null> {
    return await this.blogRepo.findOne({ where: { id } });
  }
}
