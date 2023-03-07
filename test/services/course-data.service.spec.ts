import { Test, TestingModule } from '@nestjs/testing';
import { CourseDataService } from '../../src/services/course-data/course-data.service';

describe('CourseDataService', () => {
  let service: CourseDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseDataService],
    }).compile();

    service = module.get<CourseDataService>(CourseDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
