import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentRepository } from 'src/shared/database/repositories/appointments.repositories';
import { AppointmentStatusEnum } from './entities/AppointmentStatusEnum';
import { ReserveAppointmentDto } from './dto/reserve-appointment.dto';
import { ClientRepository } from 'src/shared/database/repositories/client.repositories';
import { AppointmentHelper } from 'src/shared/helpers/appointments/appointments.helpers';
import {
  Appointment,
  PaymentTypeEnum,
  Prisma,
  TransactionEnum,
} from '@prisma/client';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { ConfirmAppointmentDto } from './dto/confirm-appointment.dto';
import { isSameDay, isSameWeek } from 'date-fns';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepo: AppointmentRepository,
    private readonly clientRepo: ClientRepository,
    private readonly appointmentHelper: AppointmentHelper,
  ) {}

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

  findAll(userId: string, filters: { status: AppointmentStatusEnum }) {
    return this.appointmentsRepo.findMany({
      where: { userId, status: filters.status },
      include: {
        category: true,
      },
      orderBy: {
        status: 'desc',
      },
    });
  }

  async reserveAppointment(
    appointmentId: string,
    { email, name, phone, service }: ReserveAppointmentDto,
  ) {
    const appointment = await this.appointmentsRepo.findUnique({
      where: { id: appointmentId },
    });

    if (appointment.status !== AppointmentStatusEnum.OPEN) {
      throw new ConflictException('Appointment already reserved');
    }

    let client = await this.clientRepo.findUnique({
      where: { email: email },
      select: { id: true, appointments: true },
    });

    if (!client) {
      client = await this.clientRepo.create({
        data: {
          name,
          email: email,
          phone,
        },
        select: {
          id: true,
          email: true,
        },
      });
    }

    const isValid = this.validateAppointments(
      appointment.date,
      client.appointments,
    );

    if (!isValid) {
      throw new ConflictException('Client cannot reserve this appointment');
    }

    await this.appointmentsRepo.update({
      where: { id: appointment.id },
      data: {
        clientId: client.id,
        status: AppointmentStatusEnum.RESERVED,
        category: {
          connect: [{ id: service }],
        },
      },
    });

    return client;
  }

  async confirmAppointment(
    userId: string,
    appointmentId: string,
    confirmAppointmentDto: ConfirmAppointmentDto,
  ) {
    /*  const appointment = await this.appointmentHelper.validateOwner(
      appointmentId,
      userId,
    );

    if (appointment.status === AppointmentStatusEnum.CONFIRMED) {
      throw new ConflictException('Appointment already confirmed');
    }

    const category = appointment?.category;
    const transactionLabel = `${category.name}: ${appointment?.user.name}`;

    await this.appointmentsRepo.update({
      where: { id: appointment.id },
      data: {
        status: AppointmentStatusEnum.CONFIRMED,
        transactions: {
          create: {
            date: confirmAppointmentDto.date,
            paymentType: confirmAppointmentDto.paymentType,
            bankAccountId: confirmAppointmentDto.bankAccountId,
            name: transactionLabel,
            value: 0, //ver com a maisa sobre preços volateis
            type: TransactionEnum.SERVICE,
            categoryId: category.id,
            userId,
          },
        },
      },
    });

    return appointment;
 */
  }

  validateAppointments(date: Date, appointments: Appointment[]) {
    if (!appointments.length) return true;

    const MAX_WEEK_APPOINTMENTS = 2;
    let hasAppearedInSameWeek = 0;

    return !appointments.some((appointment) => {
      if (isSameWeek(appointment.date, date)) hasAppearedInSameWeek++;

      return (
        isSameDay(appointment.date, date) ||
        hasAppearedInSameWeek >= MAX_WEEK_APPOINTMENTS
      );
    });
  }
}
