import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Course } from 'src/interfaces/course.interface';
import { SubscriptionService } from 'src/services/subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  subscribeCourse(@Body() body: any): Course {
    const { user, course } = body;
    this.subscriptionService.subscribeCourse(user.email, course);
    return course;
  }

  @Post('unsubscribe')
  unsubscribeCourse(@Body() body: any): Course {
    const { user, course } = body;
    this.subscriptionService.unsubscribeCourse(user.email, course);
    return course;
  }

  @Delete('deleteAllSubscriptions/:email')
  async deleteAllSubscriptions(@Param('email') email: string): Promise<void> {
    await this.subscriptionService.unsubscribeAllCourses(email);
  }

  @Get('getSubscribedCRNs/:email')
  async getUserSubscribedCRNs(
    @Param('email') email: string,
  ): Promise<string[]> {
    const subscribedCRNs = await this.subscriptionService.getUserSubscribedCRNs(
      email,
    );
    return subscribedCRNs;
  }

  @Get('getSubscribedCourses/:email')
  async getUserSubscribedCourses(
    @Param('email') email: string,
  ): Promise<Course[]> {
    return await this.subscriptionService.getUserSubscribedCourses(email);
  }

  @Get('count')
  async getSubscriptionsCount(): Promise<number> {
    return await this.subscriptionService.getSubscriptionsCount();
  }
}
