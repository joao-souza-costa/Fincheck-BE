import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class ReserveAppointmentDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  phone: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  service: string;
}
