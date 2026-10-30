/*
  Warnings:

  - You are about to drop the `review_schedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "review_schedules" DROP CONSTRAINT "review_schedules_problemId_fkey";

-- DropForeignKey
ALTER TABLE "review_schedules" DROP CONSTRAINT "review_schedules_userId_fkey";

-- DropTable
DROP TABLE "review_schedules";
