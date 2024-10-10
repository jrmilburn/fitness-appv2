/*
  Warnings:

  - Added the required column `updatedAt` to the `Excercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Set` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Week` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Excercise" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Week" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
