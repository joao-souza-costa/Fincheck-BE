import { Prisma } from '@prisma/client';

export type ClientAppointment = Prisma.ClientGetPayload<{
  include: { appointments: true };
}>;
