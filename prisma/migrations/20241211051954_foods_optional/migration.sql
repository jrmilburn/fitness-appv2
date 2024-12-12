/*
  Warnings:

  - You are about to drop the column `date` on the `DailyLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyLog" DROP COLUMN "date",
ALTER COLUMN "id" SET DEFAULT '';
