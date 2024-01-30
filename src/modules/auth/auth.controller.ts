import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn';
import { SignUpDto } from './dto/signUp';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { SendResetPasswordEmailDto } from './dto/sendResetPasswordEmail';
import { ResetPasswordDto } from './dto/resetPasswordDto';

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

  @Post('/reset-password')
  sendResetPasswordEmail(
    @Body() sendResetPasswordDto: SendResetPasswordEmailDto,
  ) {
    return this.authService.sendResetPasswordEmail(sendResetPasswordDto);
  }

  @Put('/reset-password/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('id') TokenId: string,
  ) {
    return this.authService.resetPassword(resetPasswordDto, TokenId);
  }
}
