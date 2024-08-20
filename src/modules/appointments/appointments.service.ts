import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentRepository } from 'src/shared/database/repositories/appointments.repositories';
import { AppointmentStatusEnum } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private readonly appointmentsRepo: AppointmentRepository) {}
  create(userId: string, createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsRepo.create({
      data: {
        userId,
        date: createAppointmentDto.date,
        status: AppointmentStatusEnum.OPEN,
      },
      select: {
        id: true,
        date: true,
        status: true,
      },
    });
  }

  findAll() {
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
