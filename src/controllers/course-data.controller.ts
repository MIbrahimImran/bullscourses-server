import { Controller, Get, Param } from '@nestjs/common';
import { Course } from 'src/interfaces/course.interface';
import { CourseDataService } from 'src/services/course-data.service';

@Controller('courses')
export class CourseDataController {
  constructor(private courseDataService: CourseDataService) {}

  @Get(':userInput')
  getAllCourses(@Param('userInput') userInput: string): Course[] {
    return this.courseDataService.getCourses(userInput);
  }

  @Get('subscribed/:email')
  async getSubscribedCourses(@Param('email') email: string): Promise<Course[]> {
    return await this.courseDataService.getUserSubscribedCourses(email);
  }
}
