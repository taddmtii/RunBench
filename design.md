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
