-- AlterTable
ALTER TABLE "Excercise" ADD COLUMN     "autoRegulatorId" TEXT,
ADD COLUMN     "autoregulation" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "autoRegulator" (
    "id" TEXT NOT NULL,
    "soreness" INTEGER NOT NULL DEFAULT 0,
    "jointpain" INTEGER NOT NULL DEFAULT 0,
    "workload" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "autoRegulator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Excercise" ADD CONSTRAINT "Excercise_autoRegulatorId_fkey" FOREIGN KEY ("autoRegulatorId") REFERENCES "autoRegulator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
