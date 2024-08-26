/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `competitions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "competitions_name_startDate_endDate_key";

-- CreateIndex
CREATE UNIQUE INDEX "competitions_name_key" ON "competitions"("name");
