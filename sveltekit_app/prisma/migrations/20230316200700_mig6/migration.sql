/*
  Warnings:

  - Made the column `gameId` on table `Attempt` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_gameId_fkey";

-- AlterTable
ALTER TABLE "Attempt" ALTER COLUMN "gameId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
