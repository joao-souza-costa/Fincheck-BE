import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { BankAccountHelper } from 'src/shared/helpers/bank-accounts/bank-accounts.helpers';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAccountsRepo: BankAccountRepository,
    private readonly bankAccountsHelper: BankAccountHelper,
  ) {}

  create(userId: string, { name, type, color }: CreateBankAccountDto) {
    return this.bankAccountsRepo.create({
      data: {
        name,
        type,
        color,
        userId,
      },
      select: {
        name: true,
        type: true,
        color: true,
      },
    });
  }

  async findAll(userId: string) {
    const bankAccounts = await this.bankAccountsRepo.findMany({
      where: {
        userId,
      },
      include: {
        transactions: {
          select: {
            type: true,
            value: true,
            id: true,
          },
        },
      },
    });

    return bankAccounts;
  }

  findOne(id: number) {
    return `This action returns a #${id} bankAccount`;
  }

  async update(
    userId: string,
    id: string,
    { name, type, color }: UpdateBankAccountDto,
  ) {
    await this.bankAccountsHelper.validateOwner(id, userId);

    return this.bankAccountsRepo.update({
      where: { id },
      data: {
        name,
        type,
        color,
      },
      select: {
        name: true,
        type: true,
        color: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.bankAccountsHelper.validateOwner(id, userId);

    return this.bankAccountsRepo.delete({
      where: { id },
    });
  }
}
