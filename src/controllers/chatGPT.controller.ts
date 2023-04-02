import { Body, Controller, Post } from '@nestjs/common';
import { ChatGPTService } from 'src/services/chatGPT.service';

@Controller('chatgpt')
export class ChatGPTController {
  constructor(private chatGPTService: ChatGPTService) {}

  @Post('prompt')
  getGeneratedQuestions(@Body() body: any): Promise<string> {
    const { prompt } = body;
    return this.chatGPTService.getGeneratedQuestions(prompt);
  }
}
