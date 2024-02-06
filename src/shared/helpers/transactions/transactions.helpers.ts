import { Injectable, NotFoundException } from '@nestjs/common';
import {
  addDays,
  addMonths,
  addWeeks,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { TransactionPeriods } from 'src/modules/transactions/entities/Transaction';
import { TransactionRepository } from 'src/shared/database/repositories/transactions.repositories';

@Injectable()
export class TransactionHelper {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async validateOwner(userId: string, id: string) {
    const isOwner = await this.transactionRepo.findFirst({
      where: { id, userId },
    });

    if (!isOwner) throw new NotFoundException('Transaction not found.');
  }

  filter(type: TransactionPeriods, date: string) {
    const filter: { [key in TransactionPeriods] } = {
      WEEKLY: this.weekly,
      BIWEEKLY: this.biweekly,
      MONTHLY: this.monthly,
      DIARY: this.diary,
    };
    return filter[type](date);
  }

  weekly(date: string) {
    const formattedDate = startOfWeek(date);
    const gte = formattedDate;
    const lt = addWeeks(formattedDate, 1);

    return {
      gte,
      lt,
    };
  }

  biweekly(date: string) {
    const formattedDate = startOfWeek(date);
    const gte = formattedDate;
    const lt = addWeeks(formattedDate, 2);
    return {
      gte,
      lt,
    };
  }

  monthly(date: string) {
    const formattedDate = startOfMonth(date);
    const gte = formattedDate;
    const lt = addMonths(formattedDate, 1);
    return {
      gte,
      lt,
    };
  }

  diary(date: string) {
    const formattedDate = startOfDay(date);
    const gte = formattedDate;
    const lt = addDays(formattedDate, 1);
    return {
      gte,
      lt,
    };
  }
}
