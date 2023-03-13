import { Controller, Get, Param } from '@nestjs/common';
import { Course } from 'src/interfaces/course.interface';
import { CourseDataService } from 'src/services/course-data.service';

@Controller('courses')
export class CourseDataController {
  constructor(private courseDataService: CourseDataService) {}

  @Get(':searchTerm')
  getAllCourses(@Param('searchTerm') searchTerm: string): Course[] {
    return this.courseDataService.courses;
  }
}
