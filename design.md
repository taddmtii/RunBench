# References

- Algoritum for spaced repetition : https://github.com/thyagoluciano/sm2

# Tech Stack

- Frontend: React, TS, Next.js
- Backend: Go
- Database: PostgreSQL + Prisma ORM
- Infrastructure: Supabase

# What the app needs to do:

- Execute code in a sandboxed environment in the browser
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
-
