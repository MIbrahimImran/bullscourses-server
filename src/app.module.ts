import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CourseDataController } from './controllers/course-data.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { db } from '../config/local.json';
import { User, UserSchema } from './schemas/user.schema';
import { SubscriptionService } from './services/subscription.service';
import { EmailService } from './services/email.service';
import { CourseDataService } from './services/course-data.service';
import { CourseScrapingService } from './services/course-scraping.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(db.hostUri),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CourseDataController, SubscriptionController],
  providers: [
    EmailService,
    SubscriptionService,
    CourseScrapingService,
    CourseDataService,
  ],
})
export class AppModule {}
