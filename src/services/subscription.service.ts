import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICourse } from 'src/interfaces/course.interface';
import { Logger } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { EmailService } from './email.service';
import { CourseSubscription } from 'src/interfaces/subscription.interface';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private emailService: EmailService,
  ) {}

  async subscribeCourse(userEmail: string, course: ICourse): Promise<ICourse> {
    try {
      const user = await this.userModel.findOne({ email: userEmail });

      const courseSubscription: CourseSubscription = {
        CRN: course.CRN,
        STATUS: course.STATUS,
      };

      if (user) {
        user.subscriptions.push(courseSubscription);
        await user.updateOne(user);
      } else {
        const newUser = new this.userModel({
          email: userEmail,
          subscriptions: [courseSubscription],
        });
        await newUser.save();
      }

      this.emailService.sendSubscribeNotification(course, userEmail);
      return course;
    } catch (error) {
      Logger.error(
        `Failed to subscribe course with CRN ${course.CRN} for user with email ${userEmail}: ${error.message}`,
        error,
      );
    }
  }

  async unsubscribeCourse(
    userEmail: string,
    course: ICourse,
  ): Promise<ICourse> {
    try {
      const user = await this.userModel.findOne({ email: userEmail });

      if (user) {
        const updatedSubscriptions = user.subscriptions.filter(
          (subscription) => subscription.CRN !== course.CRN,
        );
        await user.updateOne({ $set: { subscriptions: updatedSubscriptions } });
      }

      this.emailService.sendUnsubscribeNotification(course, userEmail);

      return course;
    } catch (error) {
      Logger.error(
        `Failed to unsubscribe course with CRN ${course.CRN} for user with email ${userEmail}: ${error.message}`,
        error,
      );
    }
  }

  async unsubscribeAllCourses(userEmail: string): Promise<void> {
    try {
      const user = await this.userModel.findOne({ email: userEmail });

      if (user) await user.updateOne({ $set: { subscriptions: [] } });

      this.emailService.sendUnsubscribeAllNotification(userEmail);
    } catch (error) {
      Logger.error(
        `Failed to unsubscribe all courses for user with email ${userEmail}: ${error.message}`,
        error,
      );
    }
  }

  async getUserSubscriptions(userEmail: string): Promise<CourseSubscription[]> {
    try {
      const user = await this.userModel.findOne({ email: userEmail });

      return user ? user.subscriptions : [];
    } catch (error) {
      Logger.error(`Failed to get user subscriptions: ${error.message}`, error);
    }
  }

  async getTotalSubscriptionCount(): Promise<number> {
    try {
      const users = await this.userModel.find();
      let count = 0;

      users.forEach((user) => {
        count += user.subscriptions.length;
      });

      return count;
    } catch (error) {
      Logger.error(
        `Failed to get total subscriptions count: ${error.message}`,
        error,
      );
    }
  }
}
