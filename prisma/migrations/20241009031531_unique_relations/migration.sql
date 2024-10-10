/*
  Warnings:

  - A unique constraint covering the columns `[workoutId,name]` on the table `Excercise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[programId,weekNo]` on the table `Week` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[weekId]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Excercise_workoutId_name_key" ON "Excercise"("workoutId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Week_programId_weekNo_key" ON "Week"("programId", "weekNo");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_weekId_key" ON "Workout"("weekId");
