# References

- Algoritum for spaced repetition : https://github.com/thyagoluciano/sm2

# Tech Stack

- Frontend: React, TS, Next.js
- Backend: Go
- Caching: Tanstack Query
- Database: PostgreSQL + Prisma ORM
- Infrastructure: Supabase

# What the app needs to do:

- Execute code in a sandboxed environment in the browser (Use Monaco Code Editor for easy integration)
- Analyze time complexity
- Capture how long it took to solve a problem + problems solved and store.
- Implement SM2 algorithm for spaced repitition suggestions.
- Save user notes
- Proper authentication (use jwt tokens)
  1. User logs in wiht credentials
  2. Server verifies credentials, gives JWT to client
  3. Clinet stores JWT and uses that for subsequent requests.
  4. Sever verifies the JWT on protected routes and API calls.
  - NOTE: Use Cookies instead of localStorage.
- Implement caching for relevant data (TBD)

# Initial Architecture

- src/app
- /api
  - /auth
    -route.ts
  - /problems (for every user)
    -route.ts (gets all problems for the user. GET)
  - /submissions (holds all submissions for a user and assocaited metadata GET + PATCH + POST (for notes.))
    - route.ts
  - /run
    -route.ts (spins up an isolated environment and runs the code with test cases, POST so that we can send the request with the code and all of the neccesary information.)
  - /preferences - route.ts (stores user preferences to be loaded in settings. GET + PATCH)
  - /user
    - route.ts (gets current user/profile information GET + PATCH)
- /problems
  - page.tsx (loads all problems available for user to complete.)
  - /{problemid}
    - page.tsx (displays a specific problem)
- /signup
  - page.tsx (sign up if user does not have account)
- /login
  - page.tsx (generic login page, should route to problems upon completion)
- /history
  - page.tsx (look at what problems you may need more work on, what problems you should do each day, etc...)
- page.tsx (Home)

- SM2 Timing: run on every submission to refresh that logic. We want it to recompute only when the problem is solved. Problem schedule can be independent.
- Time complexity with AI: run asyncrounously after problem is successful to avoid latency on /run calls.
- Cookies: Using httpOnly cookies prevents XSS since client side JS cannot read them.
- Security checks in sandbox:
  - CPU timeout
  - Memory limits
  - Filesystem restrictions
