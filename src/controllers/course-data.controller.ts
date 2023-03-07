import { Controller, Get } from '@nestjs/common';
import { CourseDataService } from 'src/services/course-data/course-data.service';

@Controller()
export class CourseDataController {
  constructor(private courseDataService: CourseDataService) {}

  @Get('courses')
  allCourses() {
    return this.courseDataService.courses;
  }
}
