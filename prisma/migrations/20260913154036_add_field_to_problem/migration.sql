-- AlterTable
ALTER TABLE "problems" ADD COLUMN     "recommendedSpaceComplexity" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "recommendedTimeComplexity" SET DEFAULT '';
