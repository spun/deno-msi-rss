FROM docker.io/denoland/deno:bin-2.3.6 AS deno
FROM mcr.microsoft.com/devcontainers/typescript-node:22
COPY --from=deno /deno /usr/local/bin/deno
