import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ClientRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.ClientCreateArgs) {
    return this.prismaService.client.create(createDto);
  }

  findUnique(findUniqueDto: Prisma.ClientFindUniqueArgs) {
    return this.prismaService.client.findUnique(findUniqueDto);
  }

  findClientWithAppointments(email: string) {
    return this.prismaService.client.findUnique({
      where: { email },
      include: { appointments: true },
    });
  }

  update(updateDto: Prisma.ClientUpdateArgs) {
    return this.prismaService.client.update(updateDto);
  }
}
