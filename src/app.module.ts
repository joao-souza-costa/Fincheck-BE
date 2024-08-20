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
import { MailerModule } from '@nestjs-modules/mailer';
import { env } from 'src/shared/config/env';
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        port: 465,
        secure: true,
        host: 'smtp.gmail.com',
        auth: {
          user: env.gmailEmail,
          pass: env.gmailPassword,
        },
      },
      defaults: {
        from: `${env.gmailUserName} <${env.gmailEmail}>`,
      },
    }),
    AppModules,
    UsersModule,
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    BankAccountsModule,
    HelpersModule,
    TransactionsModule,
    AppointmentsModule,
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
