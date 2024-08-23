import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { OptionalParseEnumPipe } from 'src/shared/pipes/OptionalParseEnumPipe';
import { AppointmentStatusEnum } from './entities/AppointmentStatusEnum';
import { ReserveAppointmentDto } from './dto/reserve-appointment.dto';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { ConfirmAppointmentDto } from './dto/confirm-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(
    @ActiveUserId() userId: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(userId, createAppointmentDto);
  }

  @IsPublic()
  @Get('client/:id')
  findAllOpen(@Param('id') userId: string) {
    return this.appointmentsService.findAll(userId, {
      status: AppointmentStatusEnum.OPEN,
    });
  }

  @Get(':id')
  findAll(
    @Param('id') userId: string,
    @Query('status', new OptionalParseEnumPipe(AppointmentStatusEnum))
    status?: AppointmentStatusEnum,
  ) {
    return this.appointmentsService.findAll(userId, {
      status,
    });
  }

  @IsPublic()
  @Patch('client/:id')
  reserveAppointment(
    @Param('id') appointmentId: string,
    @Body() reserveAppointmentDto: ReserveAppointmentDto,
  ) {
    return this.appointmentsService.reserveAppointment(
      appointmentId,
      reserveAppointmentDto,
    );
  }

  @Post('confirm/:id')
  confirmAppointment(
    @ActiveUserId() userId: string,
    @Param('id') appointmentId: string,
    @Body() confirmAppointmentDto: ConfirmAppointmentDto,
  ) {
    return this.appointmentsService.confirmAppointment(
      userId,
      appointmentId,
      confirmAppointmentDto,
    );
  }
}
