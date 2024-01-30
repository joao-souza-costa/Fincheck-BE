import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendResetPasswordEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
