/*
  Warnings:

  - Made the column `updatedAt` on table `Excercise` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Excercise" ADD COLUMN     "createdById" TEXT,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Excercise" ADD CONSTRAINT "Excercise_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
