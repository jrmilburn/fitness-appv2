-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_dailylogId_fkey";

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "custom" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "dailylogId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_dailylogId_fkey" FOREIGN KEY ("dailylogId") REFERENCES "DailyLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
