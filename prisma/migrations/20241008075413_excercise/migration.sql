-- DropForeignKey
ALTER TABLE "Excercise" DROP CONSTRAINT "Excercise_workoutId_fkey";

-- AlterTable
ALTER TABLE "Excercise" ALTER COLUMN "workoutId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Excercise" ADD CONSTRAINT "Excercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
