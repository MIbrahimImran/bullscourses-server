import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CourseDataService } from './services/course-data/course-data.service';
import { CourseDataController } from './controllers/course-data.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { db } from '../config/local.json';

@Module({
  imports: [ScheduleModule.forRoot(), MongooseModule.forRoot(db.hostUri)],
  controllers: [AppController, CourseDataController],
  providers: [AppService, CourseDataService],
})
export class AppModule {}
