-- CreateTable
CREATE TABLE "reset_password_token" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "expired_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reset_password_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_token_user_id_key" ON "reset_password_token"("user_id");

-- AddForeignKey
ALTER TABLE "reset_password_token" ADD CONSTRAINT "reset_password_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
