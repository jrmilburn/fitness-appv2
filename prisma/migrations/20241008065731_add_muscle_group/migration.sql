/*
  Warnings:

  - You are about to drop the column `muscleGroup` on the `Excercise` table. All the data in the column will be lost.
  - Added the required column `muscleGroupId` to the `Excercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Excercise" DROP COLUMN "muscleGroup",
ADD COLUMN     "muscleGroupId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MuscleGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MuscleGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MuscleGroup_name_key" ON "MuscleGroup"("name");

-- AddForeignKey
ALTER TABLE "Excercise" ADD CONSTRAINT "Excercise_muscleGroupId_fkey" FOREIGN KEY ("muscleGroupId") REFERENCES "MuscleGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
