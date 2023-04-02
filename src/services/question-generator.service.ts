import { Injectable, Logger } from '@nestjs/common';
import { ChatGPTService } from './chatGPT.service';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'src/schemas/course.schema';

import { Model } from 'mongoose';
import { ICourse } from 'src/interfaces/course.interface';

@Injectable()
export class QuestionGeneratorService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private readonly chatGPTService: ChatGPTService,
  ) {}

  async getGeneratedQuestions(
    course: ICourse,
    prompt: string,
  ): Promise<string> {
    const formattedPrompt = this.formatPrompt(prompt);
    try {
      const generatedResponse = await this.chatGPTService.sendMessage(
        formattedPrompt,
      );

      const jsonObject = JSON.parse(generatedResponse);

      const matchedCourses = await this.courseModel.findOne({
        CRN: course.CRN,
      });

      if (matchedCourses) {
        matchedCourses.questions.push(...jsonObject);
        await matchedCourses.save();
      } else {
        const newCourse = new this.courseModel({
          CRN: course.CRN,
          questions: [...jsonObject],
        });
        await newCourse.save();
      }

      return generatedResponse;
    } catch (error) {
      Logger.error('Error generating questions: ', error);
    }
  }

  private formatPrompt(prompt: string): string {
    prompt += 'Give me 3 similar & relevant questions & detailed answers.';
    prompt +=
      'Return parsable JSON format, array of objects with question & answer keys.';
    return prompt;
  }
}
