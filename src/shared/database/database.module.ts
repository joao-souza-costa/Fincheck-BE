import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/users.repositories';
import { CategoryRepository } from './repositories/categories.repositories';
import { BankAccountRepository } from './repositories/bank-accounts.repositories';
import { TransactionRepository } from './repositories/transactions.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CategoryRepository,
    BankAccountRepository,
    TransactionRepository,
  ],
  exports: [
    UsersRepository,
    CategoryRepository,
    BankAccountRepository,
    TransactionRepository,
  ],
})
export class DatabaseModule {}
