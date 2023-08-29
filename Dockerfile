FROM node:lts-alpine3.18

# Install pnpm with corepack
RUN rm -rf /var/cache/apk/*; corepack enable && corepack prepare pnpm@latest --activate; mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app
ENV PNPM_HOME=/usr/local/bin

WORKDIR /usr/src/node-app

COPY package.json pnpm-lock.yaml ./

USER node

RUN pnpm install --frozen-lockfile

COPY --chown=node:node . /usr/src/node-app/

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 CMD ["/usr/local/bin/node", "/usr/src/node-app/healthcheck.js"]
