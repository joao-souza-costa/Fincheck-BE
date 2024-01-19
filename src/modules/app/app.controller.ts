import { Controller, Get } from '@nestjs/common';
import { IsPublic } from 'src/shared/decorators/IsPublic';

@Controller()
@IsPublic()
export class AppController {
  @Get('/')
  signIn() {
    return { message: true, statusCode: 200 };
  }
}
