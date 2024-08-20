import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/users.repositories';
import { CategoryRepository } from './repositories/categories.repositories';
import { BankAccountRepository } from './repositories/bank-accounts.repositories';
import { TransactionRepository } from './repositories/transactions.repositories';
import { AppointmentRepository } from './repositories/appointments.repositories';
@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CategoryRepository,
    BankAccountRepository,
    TransactionRepository,
    AppointmentRepository,
  ],
  exports: [
    UsersRepository,
    CategoryRepository,
    BankAccountRepository,
    TransactionRepository,
    AppointmentRepository,
  ],
})
export class DatabaseModule {}
