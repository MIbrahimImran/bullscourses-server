import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ICourse } from 'src/interfaces/course.interface';
import { CourseSubscription } from 'src/interfaces/subscription.interface';
import { SubscriptionService } from 'src/services/subscription.service';

@Controller('subscription')
@UseGuards(AuthGuard('jwt'))
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  subscribeCourse(@Body() body: any): ICourse {
    const { user, course } = body;
    this.subscriptionService.subscribeCourse(user.email, course);
    return course;
  }

  @Post('unsubscribe')
  unsubscribeCourse(@Body() body: any): ICourse {
    const { user, course } = body;
    this.subscriptionService.unsubscribeCourse(user.email, course);
    return course;
  }

  @Delete('deleteAllSubscriptions')
  async deleteAllSubscriptions(@Req() req: any): Promise<void> {
    const { user } = req;
    await this.subscriptionService.unsubscribeAllCourses(user.email);
  }

  @Get('getUserSubscriptions')
  async getUserSubscribedCRNs(@Req() req: any): Promise<CourseSubscription[]> {
    const { user } = req;
    const subscribedCRNs = await this.subscriptionService.getUserSubscriptions(
      user.email,
    );
    return subscribedCRNs;
  }

  @Get('count')
  async getTotalSubscriptionCount(): Promise<number> {
    return await this.subscriptionService.getTotalSubscriptionCount();
  }
}
