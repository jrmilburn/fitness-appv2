-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalCalories" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "carbohydratesPerServe" DOUBLE PRECISION,
    "proteinPerServe" DOUBLE PRECISION,
    "fatPerServe" DOUBLE PRECISION,
    "caloriesPerServe" INTEGER,
    "dailylogId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "servingSize" DOUBLE PRECISION,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_dailylogId_fkey" FOREIGN KEY ("dailylogId") REFERENCES "DailyLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
