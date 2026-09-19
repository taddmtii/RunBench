
# starting point for image. python is the official image and slim is a trimmed down
# variant of Debian Linux with python installed. Very minimal, smaller surface.
FROM python:3.12-slim

# create non-root user so code never runs as root. useradd is linux cmd for creating a user account.
# -m creates a home directory for that user, -u 1000 sets users numeric id to 1000 and is needed
# for docker run command, sandbox is the username. Normal users have few permissions.
RUN useradd -m -u 1000 sandbox

# sets working directory in whcih the container starts in.
WORKDIR /workspace
# switches from root to the sandbox user.
USER sandbox