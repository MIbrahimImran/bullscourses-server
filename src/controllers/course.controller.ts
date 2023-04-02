import { Controller, Get, Param } from '@nestjs/common';
import { ICourse } from 'src/interfaces/course.interface';
import { CourseDataService } from 'src/services/course.service';

@Controller('courses')
export class CourseController {
  constructor(private courseDataService: CourseDataService) {}

  @Get(':searchInput')
  getCoursesBySearch(@Param('searchInput') userInput: string): ICourse[] {
    return this.courseDataService.getSearchedCourses(userInput);
  }
}
