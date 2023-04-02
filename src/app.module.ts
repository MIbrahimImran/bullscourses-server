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
import { ChatGPTService } from './services/chatGPT.service';
import { QuestionGeneratorController } from './controllers/question-generator.controller';
import { Course, CourseSchema } from './schemas/course.schema';
import { QuestionGeneratorService } from './services/question-generator.service';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(db.hostUri),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  controllers: [
    CourseController,
    SubscriptionController,
    UserController,
    QuestionGeneratorController,
  ],
  providers: [
    EmailService,
    SubscriptionService,
    CourseScrapingService,
    CourseDataService,
    UserService,
    ChatGPTService,
    QuestionGeneratorService,
  ],
})
export class AppModule {}
