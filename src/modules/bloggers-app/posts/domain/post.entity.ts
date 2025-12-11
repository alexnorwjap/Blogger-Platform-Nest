import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

type NewestLikes = {
  addedAt: Date;
  userId: string;
  login: string;
}[];

type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikes;
};

@Schema({ timestamps: true })
class Post {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({
    type: {
      likesCount: { type: Number, required: true, default: 0 },
      dislikesCount: { type: Number, required: true, default: 0 },
      myStatus: {
        type: String,
        enum: ['None', 'Like', 'Dislike'],
        required: true,
        default: 'None',
      },
      newestLikes: {
        type: [
          {
            addedAt: { type: Date, required: true },
            userId: { type: String, required: true },
            login: { type: String, required: true },
          },
        ],
        required: true,
        default: [],
      },
    },
    required: true,
    _id: false,
  })
  extendedLikesInfo: ExtendedLikesInfo;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  static create(dto: CreatePostDto, blogName: string): PostDocument {
    const post = new this();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = blogName;
    post.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
    return post as PostDocument;
  }

  update(dto: UpdatePostDto): void {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
  }

  delete(): void {
    this.deletedAt = new Date();
  }
}

const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

type PostDocument = HydratedDocument<Post>;
type PostModelType = Model<PostDocument> & typeof Post;

export { Post, PostSchema };
export type { PostDocument, PostModelType, ExtendedLikesInfo };
