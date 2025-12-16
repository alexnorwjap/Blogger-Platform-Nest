import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

@Injectable()
export class CryptoService {
  constructor() {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async checkPasswords(args: {
    password: string;
    hash: string;
  }): Promise<boolean> {
    return await bcrypt.compare(args.password, args.hash);
  }
}
