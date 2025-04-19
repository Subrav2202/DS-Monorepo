# --- Build Stage ---
    FROM node:18.18.0-alpine AS build

    ARG NEXUS_USER
    ARG NEXUS_PASSWORD_BASE64
    
    WORKDIR /app

    # Enable Corepack and install correct Yarn version
    RUN corepack enable && corepack prepare yarn@4.1.1 --activate
    
    # Setup .npmrc manually during build
    RUN echo "registry=http://localhost:8081/repository/Ds-Monorepo/" > .npmrc && \
        echo "//localhost:8081/repository/Ds-Monorepo/:username=${NEXUS_USER}" >> .npmrc && \
        echo "//localhost:8081/repository/Ds-Monorepo/:_password=${NEXUS_PASSWORD_BASE64}" >> .npmrc && \
        echo "//localhost:8081/repository/Ds-Monorepo/:email=subravjadhav@gmail.com" >> .npmrc && \
        echo "//localhost:8081/repository/Ds-Monorepo/:always-auth=true" >> .npmrc
    
    # Copy the entire monorepo setup
    COPY package.json ./
    COPY yarn.lock ./
    COPY .yarnrc.yml ./
    COPY .yarn ./.yarn
    COPY packages ./packages

    # Optional: override PnP linker (if needed)
    ENV YARN_NODE_LINKER=node-modules

    
    # Install all workspace dependencies
    RUN yarn install --frozen-lockfile --verbose
    
    WORKDIR /app/packages/core
    RUN yarn build-storybook
    
    # --- Release Stage ---
    FROM node:18.18.0-alpine AS release
    WORKDIR /app
    
    RUN yarn global add http-server
    
    COPY --from=build /app/packages/core/storybook-static ./storybook-static
    
    EXPOSE 5001
    
    CMD ["http-server", "storybook-static", "-p", "5001"]
    