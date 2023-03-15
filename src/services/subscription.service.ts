import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/interfaces/course.interface';
import { Logger } from '@nestjs/common';
import { UserSubscription } from 'src/interfaces/subscription.interface';
import { CourseDataService } from './course-data.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private courseDataService: CourseDataService,
  ) {}

  async subscribeCourse(userEmail: string, course: Course): Promise<Course> {
    try {
      const user = await this.userModel.findOne({
        email: userEmail,
      });

      const userSubscription: UserSubscription = {
        CRN: course.CRN,
        STATUS: course.STATUS,
      };

      if (user) {
        user.subscriptions.push(userSubscription);
        await user.updateOne(user);
      } else {
        const newUser = new this.userModel({
          email: userEmail,
          subscriptions: [userSubscription],
        });
        await newUser.save();
      }

      return course;
    } catch (error) {
      Logger.error(error);
    }
  }

  async unsubscribeCourse(userEmail: string, course: Course): Promise<Course> {
    try {
      const user = await this.userModel.findOne({
        email: userEmail,
      });

      if (user) {
        const updatedSubscriptions = user.subscriptions.filter(
          (subscription) => subscription.CRN !== course.CRN,
        );
        user.subscriptions = updatedSubscriptions;
        await user.updateOne(user);
      }

      return course;
    } catch (error) {
      Logger.error(error);
    }
  }

  async unsubscribeAllCourses(userEmail: string): Promise<void> {
    try {
      const user = await this.userModel.findOne({
        email: userEmail,
      });

      if (user) {
        user.subscriptions = [];
        await user.updateOne(user);
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  async getUserSubscriptions(userEmail: string): Promise<UserSubscription[]> {
    try {
      const user = await this.userModel.findOne({
        email: userEmail,
      });

      if (user) return user.subscriptions;

      return [];
    } catch (error) {
      Logger.error(error);
    }
  }

  async getUserSubscribedCRNs(userEmail: string): Promise<string[]> {
    try {
      const user = await this.userModel.findOne({
        email: userEmail,
      });

      if (user) {
        const subscribedCRNs = user.subscriptions.map(
          (subscription) => subscription.CRN,
        );
        return subscribedCRNs;
      }

      return [];
    } catch (error) {
      Logger.error(error);
    }
  }

  async getUserSubscribedCourses(userEmail: string): Promise<Course[]> {
    try {
      const user = await this.userModel.findOne({
        email: userEmail,
      });

      if (user) {
        const subscribedCRNs = user.subscriptions.map(
          (subscription) => subscription.CRN,
        );

        const subscribedCourses =
          this.courseDataService.getCoursesByCRNs(subscribedCRNs);

        return subscribedCourses;
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}
