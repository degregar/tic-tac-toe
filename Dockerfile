FROM node:18-alpine AS base

# ENVS
ARG NEO4J_URL
ENV NEO4J_URL=${NEO4J_URL}

ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}

ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

ARG POSTGRES_URL
ENV POSTGRES_URL=${POSTGRES_URL}

ARG POSTGRES_USER
ENV POSTGRES_USER=${POSTGRES_USER}

ARG POSTGRES_PASSWORD
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

ARG POSTGRES_DB
ENV POSTGRES_DB=${POSTGRES_DB}

ARG POSTGRES_HOST
ENV POSTGRES_HOST=${POSTGRES_HOST}

ARG POSTGRES_PORT
ENV POSTGRES_PORT=${POSTGRES_PORT}

ARG REDIS_PASSWORD
ENV REDIS_PASSWORD=${REDIS_PASSWORD}

ARG REDIS_PORT
ENV REDIS_PORT=${REDIS_PORT}

ARG REDIS_HOST
ENV REDIS_HOST=${REDIS_HOST}


# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache git openssh-client libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm i; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
