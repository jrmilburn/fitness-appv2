/*
  Warnings:

  - You are about to drop the column `servingSize` on the `Food` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dateId,userId]` on the table `DailyLog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DailyLog" ADD COLUMN     "dateId" TEXT,
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "servingSize",
ADD COLUMN     "unit" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_dateId_userId_key" ON "DailyLog"("dateId", "userId");
