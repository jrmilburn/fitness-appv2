/*
  Warnings:

  - A unique constraint covering the columns `[weekId,name]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Workout_weekId_key";

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workout_weekId_name_key" ON "Workout"("weekId", "name");
