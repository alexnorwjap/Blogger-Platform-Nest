import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};

@Schema({ timestamps: true })
class Comment {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  content: string;
  @Prop({
    type: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  commentatorInfo: CommentatorInfo;

  @Prop({
    type: {
      likesCount: { type: Number, required: true, default: 0 },
      dislikesCount: { type: Number, required: true, default: 0 },
      myStatus: { type: String, required: true, default: 'None' },
    },
    required: true,
    _id: false,
  })
  likesInfo: LikesInfo;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

type CommentDocument = HydratedDocument<Comment>;
type CommentModelType = Model<CommentDocument> & typeof Comment;

export { Comment, CommentSchema };
export type { CommentDocument, CommentModelType, CommentatorInfo, LikesInfo };
