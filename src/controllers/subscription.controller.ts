import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Course } from 'src/interfaces/course.interface';
import { User } from 'src/interfaces/user.interface';
import { SubscriptionService } from 'src/services/subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  subscribeCourse(@Body() body: any): Course {
    const { user, course } = body;
    this.subscriptionService.subscribeCourse(user, course);
    return course;
  }

  @Post('unsubscribe')
  unsubscribeCourse(@Body() body: any): Course {
    const { user, course } = body;
    this.subscriptionService.unsubscribeCourse(user, course);
    return course;
  }

  @Get('getSubscribedCRNs/:email')
  async getSubscribedCRNs(@Param('email') email: string): Promise<string[]> {
    const subscribedCRNs = await this.subscriptionService.getSubscribedCRNs(
      email,
    );
    return subscribedCRNs;
  }
}
