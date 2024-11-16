-- DropForeignKey
ALTER TABLE "Excercise" DROP CONSTRAINT "Excercise_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_userId_fkey";

-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_excerciseId_fkey";

-- DropForeignKey
ALTER TABLE "Week" DROP CONSTRAINT "Week_programId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_weekId_fkey";

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "Week_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Excercise" ADD CONSTRAINT "Excercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_excerciseId_fkey" FOREIGN KEY ("excerciseId") REFERENCES "Excercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
