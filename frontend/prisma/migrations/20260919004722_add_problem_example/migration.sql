-- CreateTable
CREATE TABLE "problem_examples" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problem_examples_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "problem_examples_problemId_idx" ON "problem_examples"("problemId");

-- AddForeignKey
ALTER TABLE "problem_examples" ADD CONSTRAINT "problem_examples_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
