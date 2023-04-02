import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ChatGPTService {
  private API_KEY = process.env.OPENAI_API_KEY;

  async getGeneratedQuestions(prompt: string): Promise<string> {
    prompt += 'Give me 3 similar questions to the above question.';
    prompt += 'For each question, give me 3 answers.';
    prompt += 'If there is code, give me the formatted code.';
    prompt += 'This is exam preparation, give me the most relevant questions.';
    prompt += 'Also, give me the answers explained in detail.';

    return await this.sendMessage(prompt);
  }

  async sendMessage(prompt: string): Promise<string> {
    const configuration = new Configuration({
      apiKey: this.API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.3,
      top_p: 1,
    });

    return completion.data.choices[0].text;
  }
}
