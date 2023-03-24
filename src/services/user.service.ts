import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getUserCount(): Promise<number> {
    try {
      const users = await this.userModel.find();
      const count = users.length;
      return count;
    } catch (error) {
      Logger.error(error);
    }
  }
}
