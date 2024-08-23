import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from 'src/modules/transactions/dto/create-transaction.dto';

export class ConfirmAppointmentDto extends PartialType(CreateTransactionDto) {}
