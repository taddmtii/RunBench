FROM mcr.microsoft.com/dotnet/sdk:10.0

ENV DOTNET_CLI_TELEMETRY_OPTOUT=1 \
    DOTNET_NOLOGO=1 \
    DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1 \
    DOTNET_SKIP_WORKLOAD_INTEGRITY_CHECK=1 \
    PublishAot=false

COPY <<'EOF' /usr/local/bin/run-csharp
#!/bin/sh
export HOME=/work DOTNET_CLI_HOME=/work TMPDIR=/work
mkdir -p /work/.nuget/NuGet
cat > /work/.nuget/NuGet/NuGet.Config <<'CFG'
<configuration>
  <packageSources>
    <clear />
  </packageSources>
</configuration>
CFG
exec dotnet run -p:PublishAot=false "$1"
EOF

RUN chmod +x /usr/local/bin/run-csharp

WORKDIR /workspace
USER 1000