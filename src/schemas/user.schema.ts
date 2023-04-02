import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CourseSubscription } from 'src/interfaces/subscription.interface';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  subscriptions: CourseSubscription[];
}

export const UserSchema = SchemaFactory.createForClass(User);
