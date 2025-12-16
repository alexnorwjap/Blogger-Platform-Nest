import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns';

const loginConstraints = {
  minLength: 3,
  maxLength: 10,
};

const passwordConstraints = {
  minLength: 6,
  maxLength: 20,
};

@Schema()
class ConfirmationSchema {
  @Prop({ type: String, required: true })
  confirmationCode: string;
  @Prop({ type: Date, required: true })
  expirationDate: Date;
}

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

  @Prop({ type: Boolean, required: true, default: false })
  isEmailConfirmed: boolean;

  @Prop({ type: ConfirmationSchema, required: true })
  confirmation: ConfirmationSchema;

  @Prop({ type: String, required: false })
  recoveryCode: string;

  @Prop({ type: Date, required: false })
  recoveryCodeExpirationDate: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  static createInstance(dto: CreateUserDto): UserDocument {
    const user = new this();
    user.login = dto.login;
    user.email = dto.email;
    user.password = dto.password;
    user.confirmation = {
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), { minutes: 15 }),
    };
    return user as UserDocument;
  }

  delete(): void {
    this.deletedAt = new Date();
  }

  resetConfirmationCode(): void {
    this.isEmailConfirmed = false;
    this.confirmation = {
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), { minutes: 15 }),
    };
  }

  confirmUser(): void {
    this.isEmailConfirmed = true;
  }

  setRecoveryCode(): void {
    this.recoveryCode = randomUUID();
    this.recoveryCodeExpirationDate = add(new Date(), { minutes: 15 });
  }

  updatePassword(newPassword: string): void {
    this.password = newPassword;
    this.recoveryCode = '';
    this.recoveryCodeExpirationDate = new Date(0);
  }
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

type UserDocument = HydratedDocument<User>;
type UserModelType = Model<UserDocument> & typeof User;

export { User, UserSchema, loginConstraints, passwordConstraints };
export type { UserDocument, UserModelType };
