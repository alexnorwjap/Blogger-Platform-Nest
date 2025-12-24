import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

class CreateLikeForCommentDto {
  userId: string;
  login: string;
  commentId: string;
  likeStatus: string;
}

@Schema({ timestamps: true })
class LikeForComment {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  userLogin: string;
  @Prop({ type: String, required: true })
  commentId: string;
  @Prop({ type: String, required: true })
  likeStatus: string;

  static createInstance(dto: CreateLikeForCommentDto): LikeForCommentDocument {
    const likeForComment = new this();
    likeForComment.userId = dto.userId;
    likeForComment.userLogin = dto.login;
    likeForComment.commentId = dto.commentId;
    likeForComment.likeStatus = dto.likeStatus;
    return likeForComment as LikeForCommentDocument;
  }

  updateStatus(newStatus: string): void {
    this.likeStatus = newStatus;
  }
}

const LikeForCommentSchema = SchemaFactory.createForClass(LikeForComment);

LikeForCommentSchema.index({ commentId: 1, userId: 1 }, { unique: true });
LikeForCommentSchema.loadClass(LikeForComment);

type LikeForCommentDocument = HydratedDocument<LikeForComment>;
type LikeForCommentModelType = Model<LikeForCommentDocument> &
  typeof LikeForComment;

export { LikeForComment, LikeForCommentSchema };
export type { LikeForCommentDocument, LikeForCommentModelType };
