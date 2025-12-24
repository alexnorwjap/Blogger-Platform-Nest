import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Schema({ _id: false })
class NewestLikes {
  @Prop({ type: Date, required: true })
  addedAt: Date;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  login: string;
}
@Schema({ _id: false })
class ExtendedLikesInfo {
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  likesCount: number;
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  dislikesCount: number;
  @Prop({
    type: String,
    enum: ['None', 'Like', 'Dislike'],
    required: true,
    default: 'None',
  })
  myStatus: string;
  @Prop({ type: [NewestLikes], required: true, default: [] })
  newestLikes: NewestLikes[];
}

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
    type: ExtendedLikesInfo,
    required: true,
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

  applyFirstReaction(likeStatus: string): void {
    if (likeStatus === 'Like') {
      this.extendedLikesInfo.likesCount++;
    } else if (likeStatus === 'Dislike') {
      this.extendedLikesInfo.dislikesCount++;
    }
  }

  updateLikesCount(previousStatus: string, newStatus: string): void {
    const getStatusDelta = (status: string) => ({
      likes: status === 'Like' ? 1 : 0,
      dislikes: status === 'Dislike' ? 1 : 0,
    });

    const previousDelta = getStatusDelta(previousStatus);
    const newDelta = getStatusDelta(newStatus);

    this.extendedLikesInfo.likesCount += newDelta.likes - previousDelta.likes;
    this.extendedLikesInfo.dislikesCount +=
      newDelta.dislikes - previousDelta.dislikes;

    this.extendedLikesInfo.likesCount = Math.max(
      0,
      this.extendedLikesInfo.likesCount,
    );
    this.extendedLikesInfo.dislikesCount = Math.max(
      0,
      this.extendedLikesInfo.dislikesCount,
    );
  }
}

const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

type PostDocument = HydratedDocument<Post>;
type PostModelType = Model<PostDocument> & typeof Post;

export { Post, PostSchema };
export type { PostDocument, PostModelType, ExtendedLikesInfo };
