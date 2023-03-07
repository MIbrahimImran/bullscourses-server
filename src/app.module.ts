import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CourseDataService } from './services/course-data/course-data.service';
import { CourseDataController } from './controllers/course-data.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController, CourseDataController],
  providers: [AppService, CourseDataService],
})
export class AppModule {}
