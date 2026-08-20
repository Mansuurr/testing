-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "messenger" TEXT DEFAULT 'phone',
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'direct';

-- CreateTable
CREATE TABLE "CalculatorResult" (
    "id" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "objectType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalculatorResult_pkey" PRIMARY KEY ("id")
);
