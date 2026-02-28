import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Post } from './post.entity';
import { User } from '../../../user-account/domain/user.entity';
import { CreateLikeForPostDto } from '../dto/create-like-for-post.dto';

@Entity('post_likes')
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  likeStatus: string;

  @Column()
  postId: string;

  @Column()
  userId: string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.postLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  static createInstance(dto: CreateLikeForPostDto): PostLike {
    const likeForPost = new PostLike();
    likeForPost.likeStatus = dto.likeStatus;
    likeForPost.postId = dto.postId;
    likeForPost.userId = dto.userId;
    return likeForPost;
  }
}
