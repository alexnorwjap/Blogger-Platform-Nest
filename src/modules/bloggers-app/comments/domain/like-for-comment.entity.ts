import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../../../user-account/domain/user.entity';
import { LikeStatusEnum } from '../../../../core/dto/update-like-input.dto';
import { LikeForCommentDto } from '../dto/input-set-like-for-comment.dto';

@Entity('comment_likes')
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: LikeStatusEnum })
  likeStatus: string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date | null;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @Column()
  commentId: string;

  @ManyToOne(() => User, (user) => user.commentLikes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  static createInstance(dto: LikeForCommentDto): CommentLike {
    const likeForComment = new CommentLike();
    likeForComment.likeStatus = dto.likeStatus;
    likeForComment.commentId = dto.commentId;
    likeForComment.userId = dto.userId;
    return likeForComment;
  }
}
