-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "client" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "birth_date" DROP NOT NULL;
