import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { Post } from '../domain/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async save(post: Post): Promise<Post> {
    return await this.postRepo.save(post);
  }

  async delete(id: string): Promise<void> {
    await this.postRepo.softDelete(id);
  }

  async getPostById(id: string): Promise<Post | null> {
    return await this.postRepo.findOne({ where: { id, deletedAt: IsNull() } });
  }
}
