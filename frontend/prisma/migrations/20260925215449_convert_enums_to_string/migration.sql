
ALTER TABLE "problems" ADD COLUMN "functionStubs" JSONB NOT NULL DEFAULT '{}';

ALTER TABLE "problems" ALTER COLUMN "difficulty" TYPE TEXT USING "difficulty"::TEXT;
ALTER TABLE "solutions" ALTER COLUMN "language" TYPE TEXT USING "language"::TEXT;
ALTER TABLE "submissions" ALTER COLUMN "language" TYPE TEXT USING "language"::TEXT;

DROP TYPE "Difficulty";
DROP TYPE "Language";