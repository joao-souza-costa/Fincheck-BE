import 'dotenv/config';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { CategoriesModule } from './modules/categories/categories.module';
import { BankAccountsModule } from './modules/bank-accounts/bank-accounts.module';
import { HelpersModule } from './shared/helpers/helpers.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AppModules } from './modules/app/app.module';

@Module({
  imports: [
    AppModules,
    UsersModule,
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    BankAccountsModule,
    HelpersModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
