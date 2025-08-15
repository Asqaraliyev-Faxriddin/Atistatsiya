/*
  Warnings:

  - You are about to drop the `Atistatsiya` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Atistatsiya";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "Fullname" TEXT NOT NULL,
    "Lastname" TEXT,
    "telegramId" BIGINT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atistatsiya" (
    "id" SERIAL NOT NULL,
    "Text" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    "C" TEXT NOT NULL,
    "D" TEXT NOT NULL,
    "AnswerKey" TEXT NOT NULL,
    "bolimId" INTEGER NOT NULL,

    CONSTRAINT "atistatsiya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtistatsiyaAnswer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "AnsCount" INTEGER NOT NULL,
    "DisCount" INTEGER NOT NULL,
    "BolimId" INTEGER NOT NULL,

    CONSTRAINT "AtistatsiyaAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegramId_key" ON "users"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- AddForeignKey
ALTER TABLE "AtistatsiyaAnswer" ADD CONSTRAINT "AtistatsiyaAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
