-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'COACH');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "_UserCoach" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserCoach_AB_unique" ON "_UserCoach"("A", "B");

-- CreateIndex
CREATE INDEX "_UserCoach_B_index" ON "_UserCoach"("B");

-- AddForeignKey
ALTER TABLE "_UserCoach" ADD CONSTRAINT "_UserCoach_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCoach" ADD CONSTRAINT "_UserCoach_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
