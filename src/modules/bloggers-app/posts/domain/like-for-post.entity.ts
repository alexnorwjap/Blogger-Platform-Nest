import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateLikeForPostDto } from '../dto/create-like-for-post.dto';

@Schema({ timestamps: true })
class LikeForPost {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  login: string;
  @Prop({ type: String, required: true })
  postId: string;
  @Prop({ type: String, required: true })
  likeStatus: string;

  static create(dto: CreateLikeForPostDto): LikeForPostDocument {
    const likeForPost = new this();
    likeForPost.userId = dto.userId;
    likeForPost.login = dto.login;
    likeForPost.postId = dto.postId;
    likeForPost.likeStatus = dto.likeStatus;
    return likeForPost as LikeForPostDocument;
  }

  updateStatus(newStatus: string): void {
    this.likeStatus = newStatus;
  }
}

const LikeForPostSchema = SchemaFactory.createForClass(LikeForPost);

LikeForPostSchema.index({ postId: 1, userId: 1 }, { unique: true });
LikeForPostSchema.index({ postId: 1, likeStatus: 1, createdAt: -1 });
LikeForPostSchema.loadClass(LikeForPost);

type LikeForPostDocument = HydratedDocument<LikeForPost>;
type LikeForPostModelType = Model<LikeForPostDocument> & typeof LikeForPost;

export { LikeForPost, LikeForPostSchema };
export type { LikeForPostDocument, LikeForPostModelType };
