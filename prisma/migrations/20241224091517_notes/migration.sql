/*
  Warnings:

  - You are about to drop the column `details` on the `Excercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Excercise" DROP COLUMN "details",
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "notes" TEXT;
