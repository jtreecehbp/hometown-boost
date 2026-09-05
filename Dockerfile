FROM node:24-alpine AS build
WORKDIR /app
ARG PUBLIC_FORM_DELIVERY=server
ARG PUBLIC_SITE_URL=https://hometownboost.com
ENV PUBLIC_FORM_DELIVERY=$PUBLIC_FORM_DELIVERY
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV SITE_INDEXING=off

COPY --from=build /app/dist ./dist
COPY server.mjs ./server.mjs

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.mjs"]
