# The image tag must match the exact @playwright/test version in package.json,
# otherwise the bundled browsers will not match the test runner.
FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

# Install dependencies in a separate layer so it is cached between builds.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV CI=true

# Credentials are NOT baked into the image: they are passed at runtime
# (docker compose env_file / docker run --env-file).
CMD ["npx", "playwright", "test"]
