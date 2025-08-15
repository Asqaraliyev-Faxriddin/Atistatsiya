-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "Fullname" TEXT NOT NULL,
    "Lastname" TEXT,
    "telegramId" BIGINT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atistatsiya" (
    "id" SERIAL NOT NULL,
    "Text" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    "C" TEXT NOT NULL,
    "D" TEXT NOT NULL,
    "AnswerKey" TEXT NOT NULL,
    "bolimId" INTEGER NOT NULL,

    CONSTRAINT "Atistatsiya_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
