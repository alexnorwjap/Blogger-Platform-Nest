import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateCommentDto } from '../dto/createCommentDto';
@Schema({ _id: false })
class CommentatorInfoSchema {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userLogin: string;
}

@Schema({ _id: false })
class LikesInfoSchema {
  @Prop({ type: Number, required: true, default: 0 })
  likesCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  dislikesCount: number;

  @Prop({ type: String, required: true, default: 'None' })
  myStatus: string;
}

type CommentatorInfo = InstanceType<typeof CommentatorInfoSchema>;
type LikesInfo = InstanceType<typeof LikesInfoSchema>;

@Schema({ timestamps: true })
class Comment {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: String, required: true })
  postId: string;
  @Prop({ type: CommentatorInfoSchema, required: true })
  commentatorInfo: CommentatorInfoSchema;

  @Prop({
    type: LikesInfoSchema,
    required: true,
    default: () => new LikesInfoSchema(),
  })
  likesInfo: LikesInfoSchema;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  static createInstance(dto: CreateCommentDto): CommentDocument {
    const comment = new this();
    comment.content = dto.content;
    comment.postId = dto.postId;
    comment.commentatorInfo = {
      userId: dto.userId,
      userLogin: dto.userLogin,
    };

    return comment as CommentDocument;
  }

  update(content: string) {
    this.content = content;
  }

  delete() {
    this.deletedAt = new Date();
  }

  applyFirstReaction(likeStatus: string): void {
    if (likeStatus === 'Like') {
      this.likesInfo.likesCount++;
    } else if (likeStatus === 'Dislike') {
      this.likesInfo.dislikesCount++;
    }
  }

  updateLikesCount(previousStatus: string, newStatus: string): void {
    const getStatusDelta = (status: string) => ({
      likes: status === 'Like' ? 1 : 0,
      dislikes: status === 'Dislike' ? 1 : 0,
    });

    const previousDelta = getStatusDelta(previousStatus);
    const newDelta = getStatusDelta(newStatus);

    this.likesInfo.likesCount += newDelta.likes - previousDelta.likes;
    this.likesInfo.dislikesCount += newDelta.dislikes - previousDelta.dislikes;

    this.likesInfo.likesCount = Math.max(0, this.likesInfo.likesCount);
    this.likesInfo.dislikesCount = Math.max(0, this.likesInfo.dislikesCount);
  }
}

const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

type CommentDocument = HydratedDocument<Comment>;
type CommentModelType = Model<CommentDocument> & typeof Comment;

export { Comment, CommentSchema };
export type { CommentDocument, CommentModelType, CommentatorInfo, LikesInfo };
