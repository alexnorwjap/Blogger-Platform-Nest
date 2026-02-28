import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from '../domain/like-for-post.entity';

@Injectable()
export class LikeForPostRepository {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepo: Repository<PostLike>,
  ) {}

  async save(likeForPost: PostLike): Promise<void> {
    await this.postLikeRepo.save(likeForPost);
  }

  async delete(id: string): Promise<void> {
    await this.postLikeRepo.softDelete(id);
  }

  async findLikeForPost(postId: string, userId: string): Promise<PostLike | null> {
    return await this.postLikeRepo.findOne({
      where: {
        postId,
        userId,
      },
      relations: ['user'],
    });
  }
}
