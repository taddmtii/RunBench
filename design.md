# RunBench

## References

- Spaced repetition algorithm (SM2): https://github.com/thyagoluciano/sm2

## Tech Stack

- **Frontend**: React, TypeScript, Next.js
- **Backend**: Go
- **Caching**: TanStack Query
- **Database**: PostgreSQL + Prisma ORM
- **Infrastructure**: Supabase

## Core Requirements

- Execute code in a sandboxed environment (Monaco Editor as the frontend component)
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
- `accepted` status on a `Submission` maps to an SM2 quality score, which drives updates to `easeFactor`, `interval`, and `repetitions`

### Time Complexity Analysis

- Computed via AI, run **asynchronously** after a successful submission
- Avoids adding latency to `/run` calls

### Sandbox Security

- CPU timeout
- Memory limits
- Filesystem restrictions

---

## Initial Architecture

    src/app
    ├── api/
    │   ├── auth/
    │   │   ├── login/
    │   │   │   └── route.ts               # POST — verify credentials, issue JWT
    │   │   ├── signup/
    │   │   │   └── route.ts               # POST — create new user
    │   │   ├── logout/
    │   │   │   └── route.ts               # POST — clear auth cookie
    │   │   └── refresh/
    │   │       └── route.ts               # POST — exchange refresh token for new access token
    │   ├── problems/
    │   │   └── route.ts                   # GET — all problems for the user
    │   ├── submissions/
    │   │   ├── route.ts                   # GET, POST — list submissions / create a new submission
    │   │   └── [submissionId]/
    │   │       └── notes/
    │   │           └── route.ts           # PATCH — update notes on a specific submission
    │   ├── run/
    │   │   └── route.ts                   # POST — spins up sandbox, runs code against test cases
    │   └── user/
    │       └── route.ts                   # GET, PATCH — current user/profile info
    ├── problems/
    │   ├── page.tsx                        # all available problems
    │   └── [problemId]/
    │       ├── page.tsx                    # specific problem view
    │       └── submissions/
    │           └── page.tsx                # this user's submission history for this problem
    ├── signup/
    │   └── page.tsx
    ├── login/
    │   └── page.tsx
    ├── history/
    │   └── page.tsx
    └── page.tsx                            # Home

---

## Database Schema

### User

| Field          | Type      | Notes     |
| -------------- | --------- | --------- |
| id             | uuid (PK) |           |
| firstName      | string    |           |
| lastName       | string    |           |
| email          | string    | `@unique` |
| username       | string    | `@unique` |
| hashedPassword | string    |           |
| createdAt      | datetime  |           |
| updatedAt      | datetime  |           |

### Problem

| Field                     | Type                    | Notes                                       |
| ------------------------- | ----------------------- | ------------------------------------------- |
| id                        | uuid (PK)               |                                             |
| title                     | string                  | e.g. "Two Sum"                              |
| description               | string                  |                                             |
| difficulty                | string (enum)           | `DifficultyLevel`: `EASY`, `MEDIUM`, `HARD` |
| recommendedTimeComplexity | string                  | e.g. "O(1) space, O(n) time"                |
| solutions                 | relation → `Solution[]` |                                             |
| createdAt                 | datetime                |                                             |
| updatedAt                 | datetime                |                                             |

### Solution

_(predefined reference solutions, separate from user submissions)_

| Field          | Type                    | Notes |
| -------------- | ----------------------- | ----- |
| id (PK)        |                         |       |
| problemId      | FK → Problem            |       |
| name           | string                  |       |
| description    | string                  |       |
| timeComplexity | string                  |       |
| language       | string (enum candidate) |       |
| rawCode        | string                  |       |
| runtime        | integer                 |       |
| optimal        | boolean                 |       |
| createdAt      | datetime                |       |
| updatedAt      | datetime                |       |

### Submission

| Field                  | Type         | Notes                        |
| ---------------------- | ------------ | ---------------------------- |
| id (PK)                |              |                              |
| userId                 | FK → User    |                              |
| problemId              | FK → Problem |                              |
| rawCode                | string       |                              |
| language               | string       |                              |
| runtime                | integer      |                              |
| proposedOptimal        | boolean      | AI judgment                  |
| proposedTimeComplexity | string       | AI judgment                  |
| notes                  | string       | user's notes on this attempt |
| accepted               | boolean      | drives SM2 + history stats   |
| createdAt              | datetime     |                              |
| updatedAt              | datetime     |                              |

### ReviewSchedule

_(SM2 state — one row per user+problem)_

| Field          | Type         | Notes                                                                                 |
| -------------- | ------------ | ------------------------------------------------------------------------------------- |
| id (PK)        |              |                                                                                       |
| userId         | FK → User    |                                                                                       |
| problemId      | FK → Problem |                                                                                       |
| easeFactor     | float        | how easy this item is for the user; starts at 2.5; rises on success, falls on failure |
| interval       | int          | days to wait before showing this problem again                                        |
| repetitions    | int          | consecutive successful recalls; resets to 0 on failure                                |
| nextReviewAt   | datetime     |                                                                                       |
| lastReviewedAt | datetime     |                                                                                       |
| createdAt      | datetime     |                                                                                       |
| updatedAt      | datetime     |                                                                                       |

### TestCase

| Field          | Type         | Notes |
| -------------- | ------------ | ----- |
| id (PK)        |              |       |
| problemId      | FK → Problem |       |
| input          | JSON         |       |
| expectedOutput | string       |       |
| createdAt      | datetime     |       |
| updatedAt      | datetime     |       |
