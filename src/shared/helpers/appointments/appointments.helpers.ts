import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentRepository } from 'src/shared/database/repositories/appointments.repositories';

@Injectable()
export class AppointmentHelper {
  constructor(private readonly appointmentsRepo: AppointmentRepository) {}

  async validateOwner(id: string, userId: string) {
    const isOwner = await this.appointmentsRepo.findFirst({
      where: { id, userId },
      select: {
        client: true,
        category: true,
        id: true,
        status: true,
      },
    });

    if (!isOwner) throw new NotFoundException('Appointment not found.');

    return isOwner;
  }
}
