/*
  Warnings:

  - Made the column `time` on table `Attempt` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attempt" ALTER COLUMN "time" SET NOT NULL;
