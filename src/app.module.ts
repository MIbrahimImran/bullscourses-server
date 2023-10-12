import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CourseController } from './controllers/course.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { db } from '../config/local.json';
import { User, UserSchema } from './schemas/user.schema';
import { SubscriptionService } from './services/subscription.service';
import { EmailService } from './services/email.service';
import { CourseDataService } from './services/course.service';
import { CourseScrapingService } from './services/scraping.service';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(db.hostUri),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CourseController, SubscriptionController, UserController],
  providers: [
    EmailService,
    SubscriptionService,
    CourseScrapingService,
    CourseDataService,
    UserService,
  ],
})
export class AppModule {}
