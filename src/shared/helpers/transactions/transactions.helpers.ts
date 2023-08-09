import { Injectable, NotFoundException } from '@nestjs/common';
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
}
