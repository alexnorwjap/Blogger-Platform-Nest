class UserTypeORM {
  id: string;
  login: string;
  email: string;
  password: string;
  isEmailConfirmed: boolean;
  confirmationCode: string;
  confirmationExpirationDate: Date;
  recoveryCode: string | null;
  recoveryCodeExpirationDate: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

class ToUserEntity {
  static mapToEntity(user: any[]): UserTypeORM {
    return {
      id: user[0].id,
      login: user[0].login,
      email: user[0].email,
      password: user[0].password,
      isEmailConfirmed: user[0].isEmailConfirmed,
      confirmationCode: user[0].confirmationCode,
      confirmationExpirationDate: user[0].confirmationExpirationDate,
      recoveryCode: user[0].recoveryCode,
      recoveryCodeExpirationDate: user[0].recoveryCodeExpirationDate,
      deletedAt: user[0].deletedAt,
      createdAt: user[0].createdAt,
      updatedAt: user[0].updatedAt,
    };
  }
}

export { UserTypeORM, ToUserEntity };
