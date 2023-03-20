/*
  Warnings:

  - Added the required column `playerId` to the `Foul` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Foul" ADD COLUMN     "playerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Foul" ADD CONSTRAINT "Foul_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
