import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AppointmentStatusEnum } from '../entities/AppointmentStatusEnum';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
