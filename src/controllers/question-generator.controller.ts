import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuestionGeneratorService } from 'src/services/question-generator.service';

@Controller('question')
@UseGuards(AuthGuard('jwt'))
export class QuestionGeneratorController {
  constructor(
    private readonly questionGeneratorService: QuestionGeneratorService,
  ) {}

  @Post('generate')
  getGeneratedQuestions(@Body() body: any): Promise<string> {
    const { prompt, course } = body;
    return this.questionGeneratorService.getGeneratedQuestions(course, prompt);
  }
}
