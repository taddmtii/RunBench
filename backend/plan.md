https://grokipedia.com/page/Code_sandboxing_with_Docker

https://en.wikipedia.org/wiki/Daemon_(computing)

- Unprivledged modes to ensure user may not gain privledges up to the host via a vulnerability.

# Core points of isolation

- Process isolation (linux namespace, process only has its own view of system)
- Filesystem isolation (overlay filesystems to create a view of files (its own filesystem theoretically), untrusted code cannot access of modify host directories.)
- Resource isolation (cgroups, limits CPU, memory and I/O usage)

# Go Concurrency

1. Goroutines via go keyword
   - goroutine: function running concurrently with the code that started it.
2. sync.WaitGroup: waiting for goroutines to finish
   - synchronization primitive that allows you to wait for a colection of goroutines to finish executing.
   - you would use Add(n) to set number of goroutines to wait for and then each goroutine would call Done().
   - Main goroutine calls Wait() to block until all are done.
3. Race conditions
   - Ex. two goroutines touch the same variable at the same time and one is writing.
     How to Avoid: 1. give each goroutine its own slot to write to. 2. Protect shared data witha. sync.Mutex (for locking, modifying, unlocking) 3. Send results through a channel instead of sharing memory.
4. Channels
   - Pipe for passing values between goroutines.
   - Buffered channel as a semaphore to cap how many containers run at once
