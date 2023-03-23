/*
  Warnings:

  - You are about to drop the `Goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameToTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_gameId_fkey";

-- DropForeignKey
ALTER TABLE "_GameToTeam" DROP CONSTRAINT "_GameToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameToTeam" DROP CONSTRAINT "_GameToTeam_B_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "winnerId" INTEGER;

-- DropTable
DROP TABLE "Goal";

-- DropTable
DROP TABLE "_GameToTeam";

-- CreateTable
CREATE TABLE "Attempt" (
    "id" SERIAL NOT NULL,
    "time" INTEGER,
    "distance" INTEGER,
    "goal" BOOLEAN NOT NULL DEFAULT false,
    "penalty" BOOLEAN NOT NULL DEFAULT false,
    "onTarget" BOOLEAN NOT NULL DEFAULT false,
    "shooterId" INTEGER NOT NULL,
    "gameId" INTEGER,
    "assisteeId" INTEGER,
    "goalieId" INTEGER,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_teamsInGame" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_teamsInGame_AB_unique" ON "_teamsInGame"("A", "B");

-- CreateIndex
CREATE INDEX "_teamsInGame_B_index" ON "_teamsInGame"("B");

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_shooterId_fkey" FOREIGN KEY ("shooterId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_assisteeId_fkey" FOREIGN KEY ("assisteeId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_goalieId_fkey" FOREIGN KEY ("goalieId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teamsInGame" ADD CONSTRAINT "_teamsInGame_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teamsInGame" ADD CONSTRAINT "_teamsInGame_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
