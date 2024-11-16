/*
  Warnings:

  - You are about to drop the `_UserCoach` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserCoach" DROP CONSTRAINT "_UserCoach_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserCoach" DROP CONSTRAINT "_UserCoach_B_fkey";

-- DropTable
DROP TABLE "_UserCoach";

-- CreateTable
CREATE TABLE "UserFollow" (
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("fromUserId","toUserId")
);

-- CreateTable
CREATE TABLE "UserCoach" (
    "clientUserId" TEXT NOT NULL,
    "coachUserId" TEXT NOT NULL,

    CONSTRAINT "UserCoach_pkey" PRIMARY KEY ("clientUserId","coachUserId")
);

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoach" ADD CONSTRAINT "UserCoach_clientUserId_fkey" FOREIGN KEY ("clientUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoach" ADD CONSTRAINT "UserCoach_coachUserId_fkey" FOREIGN KEY ("coachUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
