import { Controller, Get, Param } from '@nestjs/common';
import { Course } from 'src/interfaces/course.interface';
import { CourseDataService } from 'src/services/course.service';

@Controller('courses')
export class CourseDataController {
  constructor(private courseDataService: CourseDataService) {}

  @Get(':searchInput')
  getCoursesBySearch(@Param('searchInput') userInput: string): Course[] {
    return this.courseDataService.getSearchedCourses(userInput);
  }
}
