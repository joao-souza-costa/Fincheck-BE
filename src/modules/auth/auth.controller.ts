import { Body, Controller, Post, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn';
import { SignUpDto } from './dto/signUp';
import { IsPublic } from 'src/shared/decorators/IsPublic';

@Controller('auth')
@IsPublic()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signup')
  signUp(@Body() SignUpDto: SignUpDto) {
    return this.authService.signUp(SignUpDto);
  }
}
