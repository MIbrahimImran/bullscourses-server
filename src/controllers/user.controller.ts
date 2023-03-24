import { Controller, Get } from '@nestjs/common';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('count')
  getUserCount(): Promise<number> {
    return this.userService.getUserCount();
  }
}
