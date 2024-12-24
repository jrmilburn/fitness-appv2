/*
  Warnings:

  - You are about to drop the column `excerciseType` on the `Excercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Excercise" DROP COLUMN "excerciseType",
ADD COLUMN     "trainingType" TEXT;
