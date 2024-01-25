-- CreateEnum
CREATE TYPE "payment_type_enum" AS ENUM ('CASH', 'CREDIT', 'DEBIT', 'PIX', 'BILLET');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "payment_type" "payment_type_enum" NOT NULL DEFAULT 'PIX';
