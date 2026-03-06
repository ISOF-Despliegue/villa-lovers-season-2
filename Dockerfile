FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --fund=false && npm cache clean --force

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN rm -rf /usr/local/lib/node_modules/npm \
  && rm -f /usr/local/bin/npm /usr/local/bin/npx

USER node

COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node src ./src

EXPOSE 3000

CMD ["node", "src/index.js"]