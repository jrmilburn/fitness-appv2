-- AlterTable
ALTER TABLE "Excercise" ADD COLUMN     "endSets" INTEGER,
ADD COLUMN     "progressionType" TEXT DEFAULT 'linear',
ADD COLUMN     "startSets" INTEGER;
