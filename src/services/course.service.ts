import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { Course } from 'src/interfaces/course.interface';
import { CourseScrapingService } from './scraping.service';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CourseDataService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private courseScrapingService: CourseScrapingService,
  ) {}

  private courses: Course[] = [];
  private missingCoursesCount = 0;

  @Cron('0 * * * * *') // Runs every minute
  async handleCron() {
    const courseData = await this.courseScrapingService.getScrapedCourseData();
    this.updateCourseData(courseData);
    this.notifySubscribersOnCourseStatusChange();
  }

  getSearchedCourses(userInput: string): Course[] {
    const filteredCourses: Course[] = [];
    for (const course of this.courses) {
      if (
        this.isValidCourseTitle(userInput, course) ||
        this.isValidCourseCRN(userInput, course) ||
        this.isValidCourseCRS(userInput, course)
      ) {
        filteredCourses.push(course);
      }
    }
    return filteredCourses;
  }

  getCoursesByCRNs(crns: string[]): Course[] {
    const filteredCourses: Course[] = [];
    for (const course of this.courses) {
      if (crns.includes(course.CRN)) {
        filteredCourses.push(course);
      }
    }
    return filteredCourses;
  }

  private updateCourseData(courseData: Course[]): void {
    const lengthDifference = courseData.length - this.courses.length;
    const withinFivePercent =
      Math.abs(lengthDifference) / this.courses.length <= 0.05;

    if (this.courses.length === 0) {
      this.courses = courseData;
    } else if (lengthDifference >= 0) {
      this.courses = courseData;
      this.missingCoursesCount = 0;
    } else if (withinFivePercent) {
      this.missingCoursesCount++;
      if (this.missingCoursesCount > 5) {
        this.courses = courseData;
        this.missingCoursesCount = 0;
      }
    } else {
      this.missingCoursesCount = 0;
    }
  }

  private isValidCourseTitle(userInput: string, course: Course): boolean {
    return course.TITLE?.toLowerCase().includes(userInput.toLowerCase());
  }

  private isValidCourseCRN(userInput: string, course: Course): boolean {
    return course.CRN?.toLowerCase().includes(userInput.toLowerCase());
  }

  private isValidCourseCRS(userInput: string, course: Course): boolean {
    const trimmedInput = userInput.trim();
    const splitInput = trimmedInput.split(' ');
    if (splitInput.length === 2) {
      const [subject, courseNumber] = splitInput;
      return (
        course.SUBJ_CRS?.toLowerCase().includes(subject.toLowerCase()) &&
        course.SUBJ_CRS?.toLowerCase().includes(courseNumber.toLowerCase())
      );
    } else {
      return course.SUBJ_CRS?.toLowerCase().includes(userInput.toLowerCase());
    }
  }

  async notifySubscribersOnCourseStatusChange(): Promise<void> {
    try {
      const users = await this.userModel.find();

      for (const user of users) {
        const subscribedCRNs = user.subscriptions.map(
          (subscription) => subscription.CRN,
        );

        const subscribedCourses = this.getCoursesByCRNs(subscribedCRNs);

        for (const subscribedCourse of subscribedCourses) {
          const userSubscription = user.subscriptions.find(
            (subscription) => subscription.CRN === subscribedCourse.CRN,
          );

          if (userSubscription.STATUS !== subscribedCourse.STATUS) {
            userSubscription.STATUS = subscribedCourse.STATUS;
            await user.updateOne({ subscriptions: user.subscriptions });
          }
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}
