import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionTypes } from '../entities/Transaction';
import { PaymentTypes } from '../entities/PaymentTypes';

export class CreateTransactionDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  bankAccountId: string;

  @IsString()
  @IsUUID()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TransactionTypes)
  type: TransactionTypes;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PaymentTypes)
  paymentType: PaymentTypes;
}
