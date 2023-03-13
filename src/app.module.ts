import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CourseDataService } from './services/course-data.service';
import { CourseDataController } from './controllers/course-data.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { db } from '../config/local.json';
import { SubscriptionService } from './services/subscription.service';
import {
  Subscription,
  SubscriptionSchema,
} from './schemas/subscription.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(db.hostUri),
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [AppController, CourseDataController, SubscriptionController],
  providers: [AppService, CourseDataService, SubscriptionService],
})
export class AppModule {}
