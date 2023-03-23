-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN     "x" INTEGER,
ADD COLUMN     "y" INTEGER;

-- CreateTable
CREATE TABLE "Foul" (
    "id" SERIAL NOT NULL,
    "card" TEXT,
    "time" INTEGER,
    "x" INTEGER,
    "y" INTEGER,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "Foul_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Foul" ADD CONSTRAINT "Foul_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
