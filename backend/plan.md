https://grokipedia.com/page/Code_sandboxing_with_Docker

https://en.wikipedia.org/wiki/Daemon_(computing)

- Unprivledged modes to ensure user may not gain privledges up to the host via a vulnerability.

# Core points of isolation

- Process isolation (linux namespace, process only has its own view of system)
- Filesystem isolation (overlay filesystems to create a view of files (its own filesystem theoretically), untrusted code cannot access of modify host directories.)
- Resource isolation (cgroups, limits CPU, memory and I/O usage)
