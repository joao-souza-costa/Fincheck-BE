import { Global, Module } from '@nestjs/common';
import { BankAccountHelper } from './bank-accounts/bank-accounts.helpers';
import { CategoryHelper } from './categories/categories.helpers';
import { TransactionHelper } from './transactions/transactions.helpers';
import { AppointmentHelper } from './appointments/appointments.helpers';

@Global()
@Module({
  providers: [
    BankAccountHelper,
    CategoryHelper,
    TransactionHelper,
    AppointmentHelper,
  ],
  exports: [
    BankAccountHelper,
    CategoryHelper,
    TransactionHelper,
    AppointmentHelper,
  ],
})
export class HelpersModule {}
