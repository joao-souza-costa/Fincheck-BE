import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointment, Prisma } from '@prisma/client';
import { AppointmentRepository } from 'src/shared/database/repositories/appointments.repositories';

@Injectable()
export class AppointmentHelper {
  constructor(private readonly appointmentsRepo: AppointmentRepository) {}

  async validateOwner(id: string, userId: string) {
    const isOwner = (await this.appointmentsRepo.findFirst({
      where: { id, userId },
      include: {
        categories: true,
        client: true,
      },
    })) as Prisma.AppointmentGetPayload<{
      include: { categories: true; client: true };
    }>;

    if (!isOwner) throw new NotFoundException('Appointment not found.');

    return isOwner;
  }
}
