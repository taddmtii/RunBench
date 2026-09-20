FROM debian:bookworm-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends g++ \
 && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 sandbox

RUN printf '#!/bin/sh\ng++ -O1 -std=c++20 -o /work/a.out "$1" && /work/a.out\n' > /usr/local/bin/run-cpp \
 && chmod +x /usr/local/bin/run-cpp

WORKDIR /workspace
USER sandbox