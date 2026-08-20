FROM node:22-bookworm-slim

WORKDIR /workspace/app

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

COPY app/package.json app/pnpm-lock.yaml ./
COPY app/patches ./patches
RUN pnpm install --frozen-lockfile

COPY app/ ./
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]
