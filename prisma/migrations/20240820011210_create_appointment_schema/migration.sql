/*
  Warnings:

  - You are about to drop the column `initial_balance` on the `bank_accounts` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "appointment_status_enum" AS ENUM ('OPEN', 'RESERVED', 'CONFIRMED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "transaction_enum" ADD VALUE 'SERVICE';

-- AlterTable
ALTER TABLE "bank_accounts" DROP COLUMN "initial_balance";

-- CreateTable
CREATE TABLE "client" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "appointment_status_enum" NOT NULL,
    "client_id" UUID,
    "user_id" UUID NOT NULL,
    "category_id" UUID,
    "transaction_id" UUID,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_email_key" ON "client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_transaction_id_key" ON "appointments"("transaction_id");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
