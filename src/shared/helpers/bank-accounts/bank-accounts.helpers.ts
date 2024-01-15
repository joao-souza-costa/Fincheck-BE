import { Injectable, NotFoundException } from '@nestjs/common';
import { BankAccountRepository } from 'src/shared/database/repositories/bank-accounts.repositories';

@Injectable()
export class BankAccountHelper {
  constructor(private readonly bankAccountsRepo: BankAccountRepository) {}

  async validateOwner(id: string, userId: string) {
    const isOwner = await this.bankAccountsRepo.findFirst({
      where: { id, userId },
    });

    if (!isOwner) throw new NotFoundException('Bank account not found.');
  }
}
