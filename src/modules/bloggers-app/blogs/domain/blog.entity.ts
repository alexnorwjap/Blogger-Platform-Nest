import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { Post } from '../../posts/domain/post.entity';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ collation: 'C' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  websiteUrl: string;

  @Column({ default: false })
  isMembership: boolean;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.blog)
  posts: Post[];

  static createInstance(dto: CreateBlogDto): Blog {
    const blog = new Blog();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    return blog;
  }
}
