import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';

@Schema({ timestamps: true })
class Blog {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  websiteUrl: string;

  @Prop({ type: Boolean, required: true })
  isMembership: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  static create(dto: CreateBlogDto): BlogDocument {
    const blog = new this();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.isMembership = false;
    return blog as BlogDocument;
  }

  updateBlog(dto: UpdateBlogDto): void {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }

  delete(): void {
    this.deletedAt = new Date();
  }
}

const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.loadClass(Blog);

type BlogDocument = HydratedDocument<Blog>;

type BlogModelType = Model<BlogDocument> & typeof Blog;

export { Blog, BlogSchema };
export type { BlogDocument, BlogModelType };
