## References

- Spaced repetition algorithm: https://github.com/thyagoluciano/sm2

## Tech Stack

- **Frontend**: React, TypeScript, Next.js
- **Backend**: Go
- **Caching**: TanStack Query
- **Database**: PostgreSQL + Prisma ORM
- **Infrastructure**: Supabase

## Core Requirements

- Execute code in a sandboxed environment (Monaco Editor as frontend component)
- Analyze time complexity of submitted solutions
- Capture time-to-solve and total problems solved, and persist both
- Implement the SM2 algorithm for spaced repetition suggestions
- Save user notes (tied to submissions)
- Proper authentication using JWTs
- Implement caching for relevant data (e.g. problems list)

### Authentication Flow

1. User logs in with credentials
2. Server verifies credentials and issues a JWT
3. Client stores the JWT and includes it on subsequent requests
4. Server verifies the JWT on protected routes/API calls

### SM2 Scheduling

- Runs on every submission, recomputed only when a problem is solved
- Each problem's review schedule is independent of others

### Time Complexity Analysis

- Computed via AI, run **asynchronously** after a successful submission
- Avoids adding latency to `/run` calls

### Sandbox Security

- CPU timeout
- Memory limits
- Filesystem restrictions

## Initial Architecture

```
src/app
├── api/
│   ├── auth/
│   │   └── route.ts
│   ├── problems/
│   │   └── route.ts          # GET — all problems for the user
│   ├── submissions/
│   │   └── route.ts          # GET, PATCH, POST (notes)
│   ├── run/
│   │   └── route.ts          # POST — spins up sandbox, runs code against test cases
│   ├── preferences/
│   │   └── route.ts          # GET, PATCH
│   └── user/
│       └── route.ts          # GET, PATCH — current user/profile info
├── problems/
│   ├── page.tsx               # all available problems
│   └── [problemId]/
│       └── page.tsx           # specific problem view
├── signup/
│   └── page.tsx
├── login/
│   └── page.tsx                # routes to /problems on success
├── history/
│   └── page.tsx                # weak areas, daily suggestions, stats
└── page.tsx                    # Home
```

## Database Schema

Users

- id (uuid()) (PK)
- firstName (string)
- lastName (string)
- email (string) @unique
- username (string) @unique
- hashedPassword (string)
- preferences? (maybe I could store this information in cookies instead of the database?)
- createdAt
- updatedAt

Problems

- id (uuid())
- title (string, e.g "Two Sum")
- description (string, e.g. "Do something with these two numbers and make them dance around.")
- difficulty (string (maybe a value from an enum like DifficultyLevel (EASY, MEDIUM, HARD, etc.)))
- reccomendedTimeComplexity (string, e.g. O(1) space O(n) time)
- solutions (solution[], common solutions associated with a problem. separate from a users solution, these are predefined)
- createdAt
- updatedAt

Solutions

- id (PK)
- problemId (FK, whcih problem does this solution belong to?)
- name (string)
- description (string)
- timeComplexity (string)
- language (string)
- rawCode (string)
- runtime (string)
- optimal (boolean)
- createdAt
- updatedAt

Submissions

- id (PK)
- userId (FK) (string, which submission does this user belong to?)
- problemId (FK) (string, which problem does this submission belong to?)
- rawCode (string)
- language (string)
- runtime (string)
- proposedOptimal (string, AI can make a judgement here)
- proposedtTimeComplexity (string, AI can also make a judgment here)
- notes (string) (from Notes.content)
- accepted (boolean, dictates if a submission is accepted or not and triggers other things.)
- createdAt
- updatedAt

ReviewSchedule

- id (PK)
- userId (FK)
- problemId (FK)
- easeFactor (float) - how easy this item is for the user. starts at 2.5. Goes up when you do well and goes down when you do poorly.
- interval (int, days until next review) - how many days should you wait before showing it again.
- repetitions (int) - how many times in a row you have recalled it successfully. resets to 0 once you fail.
- nextReviewAt (datetime)
- lastReviewedAt (datetime)
- @@unique([userId, problemId])
- createdAt
- updatedAt

TestCase

- id (PK)
- problemId (FK)
- input (string, what are we putting into the submission)
- expectedOutput (string)
- createdAt
- updatedAt
