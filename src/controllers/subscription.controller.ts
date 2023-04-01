import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Course } from 'src/interfaces/course.interface';
import { CourseSubscription } from 'src/interfaces/subscription.interface';
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

  @Get('getUserSubscriptions/:email')
  async getUserSubscribedCRNs(
    @Param('email') email: string,
  ): Promise<CourseSubscription[]> {
    const subscribedCRNs = await this.subscriptionService.getUserSubscriptions(
      email,
    );
    return subscribedCRNs;
  }

  @Get('count')
  async getTotalSubscriptionCount(): Promise<number> {
    return await this.subscriptionService.getTotalSubscriptionCount();
  }
}
