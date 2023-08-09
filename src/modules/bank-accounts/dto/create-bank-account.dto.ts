import { BankAccountTypes } from '../entities/BankAccount';

import {
  IsNumber,
  IsString,
  IsEnum,
  IsNotEmpty,
  IsHexColor,
} from 'class-validator';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  initialBalance: number;

  @IsNotEmpty()
  @IsEnum(BankAccountTypes)
  type: BankAccountTypes;

  @IsHexColor()
  @IsNotEmpty()
  color: string;
}
