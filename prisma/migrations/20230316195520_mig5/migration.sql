/*
  Warnings:

  - You are about to drop the column `assisteeId` on the `Attempt` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_assisteeId_fkey";

-- AlterTable
ALTER TABLE "Attempt" DROP COLUMN "assisteeId",
ADD COLUMN     "assistedId" INTEGER;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_assistedId_fkey" FOREIGN KEY ("assistedId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
