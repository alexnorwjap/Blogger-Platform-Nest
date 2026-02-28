import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from '../../posts/domain/post.entity';
import { User } from '../../../user-account/domain/user.entity';
import { CreateCommentDto } from '../dto/createCommentDto';
import { CommentLike } from './like-for-comment.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  postId: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
  likes: CommentLike[];

  static createInstance(dto: CreateCommentDto): Comment {
    const newComment = new Comment();
    newComment.content = dto.content;
    newComment.postId = dto.postId;
    newComment.userId = dto.userId;
    return newComment;
  }
}
