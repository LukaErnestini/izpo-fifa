-- CreateTable
CREATE TABLE "_GamedayToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GamedayToPlayer_AB_unique" ON "_GamedayToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_GamedayToPlayer_B_index" ON "_GamedayToPlayer"("B");

-- AddForeignKey
ALTER TABLE "_GamedayToPlayer" ADD CONSTRAINT "_GamedayToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Gameday"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GamedayToPlayer" ADD CONSTRAINT "_GamedayToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
