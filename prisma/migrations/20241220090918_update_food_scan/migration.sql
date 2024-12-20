/*
  Warnings:

  - You are about to drop the column `caloriesPerServe` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `carbohydratesPerServe` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `fatPerServe` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `proteinPerServe` on the `Food` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Food" DROP COLUMN "caloriesPerServe",
DROP COLUMN "carbohydratesPerServe",
DROP COLUMN "fatPerServe",
DROP COLUMN "proteinPerServe",
ADD COLUMN     "carbohydratesPer100" DOUBLE PRECISION,
ADD COLUMN     "energyPer100" INTEGER,
ADD COLUMN     "fatPer100" DOUBLE PRECISION,
ADD COLUMN     "proteinPer100" DOUBLE PRECISION;
