import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/interfaces/course.interface';
import { User } from 'src/interfaces/user.interface';
import { Logger } from '@nestjs/common';
import {
  SubscriptioDocument,
  Subscription,
} from 'src/schemas/subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptioDocument>,
  ) {}

  async subscribeCourse(user: User, course: Course): Promise<Course> {
    try {
      const subscription = await this.subscriptionModel.findOne({
        email: user.email,
      });

      if (subscription) {
        subscription.subscriptions.push(course.CRN);
        await subscription.save();
      } else {
        const subscriptionCreated = new this.subscriptionModel({
          email: user.email,
          subscriptions: [course.CRN],
        });

        await subscriptionCreated.save();
      }

      return course;
    } catch (error) {
      Logger.error(error);
    }
  }

  async unsubscribeCourse(user: User, course: Course): Promise<Course> {
    try {
      const subscription = await this.subscriptionModel.findOne({
        email: user.email,
      });

      if (subscription) {
        subscription.subscriptions = subscription.subscriptions.filter(
          (crn) => crn !== course.CRN,
        );
        await subscription.updateOne(subscription);
      }

      return course;
    } catch (error) {
      Logger.error(error);
    }
  }

  async getSubscribedCRNs(email: string): Promise<string[]> {
    try {
      const subscription = await this.subscriptionModel.find({
        email,
      });
      const subscribedCRNs = subscription
        .map((subscription) => subscription.subscriptions)
        .flat();
      return subscribedCRNs;
    } catch (error) {
      Logger.error(error);
    }
  }
}
