import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';

@Schema({ timestamps: true })
class User {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  login: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  static create(dto: CreateUserDto): UserDocument {
    const user = new this();
    user.login = dto.login;
    user.email = dto.email;
    user.password = dto.password;
    return user as UserDocument;
  }

  delete(): void {
    this.deletedAt = new Date();
  }
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

type UserDocument = HydratedDocument<User>;
type UserModelType = Model<UserDocument> & typeof User;

export { User, UserSchema };
export type { UserDocument, UserModelType };
