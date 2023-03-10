import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubscriptioDocument = HydratedDocument<Subscription>;

@Schema()
export class Subscription {
  @Prop()
  email: string;

  @Prop()
  subscriptions: string[];
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
