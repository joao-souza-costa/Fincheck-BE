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
      select: {
        id: true,
        date: true,
        status: true,
        client: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        transaction: {
          select: {
            paymentType: true,
            value: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
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

    type clientWithAppointments = Prisma.PromiseReturnType<
      typeof this.clientRepo.findClientWithAppointments
    >;

    let client = await this.clientRepo.findClientWithAppointments(email);

    if (!client) {
      client = (await this.clientRepo.create({
        data: {
          name,
          email: email,
          phone,
        },
        select: {
          id: true,
          email: true,
        },
      })) as clientWithAppointments;
    }

    const isValid = this.validateAppointments(
      appointment.date,
      client?.appointments,
    );

    if (!isValid) {
      throw new ConflictException('Client cannot reserve this appointment');
    }

    await this.appointmentsRepo.update({
      where: { id: appointment.id },
      data: {
        clientId: client.id,
        status: AppointmentStatusEnum.RESERVED,
        categories: {
          connect: service.map((id) => ({ id })),
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
    const appointment = await this.appointmentHelper.validateOwner(
      appointmentId,
      userId,
    );

    if (appointment.status === AppointmentStatusEnum.CONFIRMED) {
      throw new ConflictException('Appointment already confirmed');
    }

    const transactionLabel = `${appointment?.categories
      .map((item) => item.name)
      .join(', ')}: ${appointment?.client.name}`;

    await this.appointmentsRepo.update({
      where: { id: appointment.id },
      data: {
        status: AppointmentStatusEnum.CONFIRMED,
        transaction: {
          create: {
            date: confirmAppointmentDto.date,
            paymentType: confirmAppointmentDto.paymentType,
            bankAccountId: confirmAppointmentDto.bankAccountId,
            name: transactionLabel,
            value: confirmAppointmentDto.value,
            type: TransactionEnum.SERVICE,
            userId,
          },
        },
      },
    });

    return appointment;
  }

  validateAppointments(date: Date, appointments: Appointment[]) {
    if (!appointments?.length) return true;

    const MAX_APPOINTMENTS_PEER_WEEK = 2;
    let hasAppearedInSameWeek = 0;

    return !appointments.some((appointment) => {
      if (isSameWeek(appointment.date, date)) hasAppearedInSameWeek++;

      return (
        isSameDay(appointment.date, date) ||
        hasAppearedInSameWeek >= MAX_APPOINTMENTS_PEER_WEEK
      );
    });
  }
}
