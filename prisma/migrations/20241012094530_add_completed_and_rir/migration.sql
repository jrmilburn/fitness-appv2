-- AlterTable
ALTER TABLE "Excercise" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Week" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repsInReserve" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;
