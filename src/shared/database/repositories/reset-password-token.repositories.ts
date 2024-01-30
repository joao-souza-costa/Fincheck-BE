import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ResetPasswordTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.ResetPasswordTokenCreateArgs) {
    return this.prismaService.resetPasswordToken.create(createDto);
  }

  update(updateDto: Prisma.ResetPasswordTokenUpdateArgs) {
    return this.prismaService.resetPasswordToken.update(updateDto);
  }

  findUnique(findUniqueDto: Prisma.ResetPasswordTokenFindUniqueArgs) {
    return this.prismaService.resetPasswordToken.findUnique(findUniqueDto);
  }

  delete(deleteDto: Prisma.ResetPasswordTokenDeleteArgs) {
    return this.prismaService.resetPasswordToken.delete(deleteDto);
  }
}
