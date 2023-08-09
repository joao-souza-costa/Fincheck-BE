import { Global, Module } from '@nestjs/common';
import { BankAccountHelper } from './bank-accounts/bank-accounts.helpers';
import { CategoryHelper } from './categories/categories.helpers';
import { TransactionHelper } from './transactions/transactions.helpers';

@Global()
@Module({
  providers: [BankAccountHelper, CategoryHelper, TransactionHelper],
  exports: [BankAccountHelper, CategoryHelper, TransactionHelper],
})
export class HelpersModule {}
