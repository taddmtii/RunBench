# .NET 10 SDK can run a single .cs file directly ("file-based apps"),
# so there's no project file to generate.
FROM mcr.microsoft.com/dotnet/sdk:10.0

ENV DOTNET_CLI_TELEMETRY_OPTOUT=1 \
    DOTNET_NOLOGO=1 \
    DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1

RUN useradd -m -u 1000 sandbox

# Point every writable location at /work, since the root is read-only.
RUN printf '#!/bin/sh\nexport HOME=/work DOTNET_CLI_HOME=/work TMPDIR=/work\ndotnet run "$1"\n' > /usr/local/bin/run-csharp \
 && chmod +x /usr/local/bin/run-csharp

WORKDIR /workspace
USER sandbox