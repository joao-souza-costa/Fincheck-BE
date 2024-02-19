import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from 'src/shared/database/repositories/transactions.repositories';
import { CategoryHelper } from 'src/shared/helpers/categories/categories.helpers';
import { BankAccountHelper } from 'src/shared/helpers/bank-accounts/bank-accounts.helpers';
import { TransactionHelper } from 'src/shared/helpers/transactions/transactions.helpers';
import { TransactionPeriods, TransactionTypes } from './entities/Transaction';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepo: TransactionRepository,
    private readonly bankAccountHelper: BankAccountHelper,
    private readonly categoryHelper: CategoryHelper,
    private readonly transactionHelper: TransactionHelper,
  ) {}

  async create(
    userId: string,
    {
      bankAccountId,
      categoryId,
      date,
      name,
      type,
      value,
      paymentType,
    }: CreateTransactionDto,
  ) {
    await this.validateOwner({ userId, bankAccountId, categoryId });

    if (type === 'EXPENSE') value *= -1;

    return this.transactionRepo.create({
      data: {
        bankAccountId,
        categoryId,
        date,
        name,
        type,
        value,
        userId,
        paymentType,
      },
      select: {
        bankAccountId: true,
        categoryId: true,
        date: true,
        name: true,
        type: true,
        value: true,
      },
    });
  }

  findAll(
    userId: string,
    filters: {
      date: string;
      period: TransactionPeriods;
      bankAccountId?: string;
      type?: TransactionTypes;
    },
  ) {
    return this.transactionRepo.findMany({
      where: {
        userId,
        type: filters.type,
        date: this.transactionHelper.filter(filters.period, filters.date),
        bankAccountId: filters.bankAccountId,
      },
      include: {
        category: {
          select: {
            icon: true,
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async update(
    userId: string,
    transactionId: string,
    {
      bankAccountId,
      categoryId,
      name,
      value,
      type,
      date,
      paymentType,
    }: UpdateTransactionDto,
  ) {
    if (type === 'EXPENSE') value *= -1;

    await this.validateOwner({
      userId,
      bankAccountId,
      categoryId,
      transactionId,
    });

    return this.transactionRepo.update({
      where: { id: transactionId },
      data: {
        name,
        value,
        categoryId,
        bankAccountId,
        paymentType,
        date,
      },
    });
  }

  async remove(userId: string, transactionId: string) {
    await this.validateOwner({ userId, transactionId });
    return this.transactionRepo.delete({
      where: { id: transactionId },
    });
  }

  private validateOwner({
    userId,
    bankAccountId,
    categoryId,
    transactionId,
  }: {
    userId: string;
    bankAccountId?: string;
    categoryId?: string;
    transactionId?: string;
  }) {
    return Promise.all([
      transactionId &&
        this.transactionHelper.validateOwner(userId, transactionId),
      // eslint-disable-next-line prettier/prettier
      categoryId &&
      this.categoryHelper.validateOwner(userId, categoryId),
      bankAccountId &&
        this.bankAccountHelper.validateOwner(bankAccountId, userId),
    ]);
  }
}
