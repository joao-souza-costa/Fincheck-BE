-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_category_id_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "observation" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_AppointmentToCategory" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AppointmentToCategory_AB_unique" ON "_AppointmentToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_AppointmentToCategory_B_index" ON "_AppointmentToCategory"("B");

-- AddForeignKey
ALTER TABLE "_AppointmentToCategory" ADD CONSTRAINT "_AppointmentToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToCategory" ADD CONSTRAINT "_AppointmentToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
