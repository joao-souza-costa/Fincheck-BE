/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `appointments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appointmentId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_transaction_id_fkey";

-- DropIndex
DROP INDEX "appointments_transaction_id_key";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "transaction_id";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "appointmentId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_appointmentId_key" ON "transactions"("appointmentId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
