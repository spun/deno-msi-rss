FROM docker.io/denoland/deno:bin-2.7.13 AS deno
FROM mcr.microsoft.com/devcontainers/typescript-node:24
COPY --from=deno /deno /usr/local/bin/deno
