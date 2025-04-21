# --- Build Stage ---
    FROM node:18.18.0-alpine AS build

    ARG NEXUS_USER
    ARG NEXUS_PASSWORD_BASE64
    
    # Add base tools
    RUN apk add --no-cache bash curl coreutils
    
    # Decode Nexus password and export as ENV (for reuse)
    ENV NEXUS_PASSWORD_DECODED=""
    RUN export NEXUS_PASSWORD_DECODED=$(echo "$NEXUS_PASSWORD_BASE64" | base64 -d) && echo "Password decoded"
    
    # Setup working directory
    WORKDIR /app
    
    # Install Yarn 4
    RUN corepack enable && corepack prepare yarn@4.1.1 --activate
    
    # Add .npmrc configuration with Nexus auth
    RUN export NEXUS_PASSWORD=$(echo "$NEXUS_PASSWORD_BASE64" | base64 -d) && \
        echo "registry=https://3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/" > .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:username=${NEXUS_USER}" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:_password=${NEXUS_PASSWORD}" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:email=dummy@email.com" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:always-auth=true" >> .npmrc && \
        echo "📝 .npmrc content:" && cat .npmrc
    
    # Debug: Curl the tarball to verify auth/download works
    RUN echo "🔍 Testing access to tarball with curl..." && \
        curl -v -u "${NEXUS_USER}:$(echo $NEXUS_PASSWORD_BASE64 | base64 -d)" \
        https://3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/@my/core/-/core-1.0.0.tgz -o test-core.tgz
    
    # Add core package (verbose)
    RUN echo "📦 Installing core package from Nexus..." && \
        yarn add --verbose https://3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/@my/core/-/core-1.0.0.tgz
    
    # Install dependencies
    RUN yarn install --frozen-lockfile
    
    # Build Storybook
    WORKDIR /app/node_modules/@my/core
    RUN yarn build-storybook
    
    # --- Release Stage ---
    FROM node:18.18.0-alpine AS release
    
    WORKDIR /app
    
    # Install static server
    RUN yarn global add http-server
    
    # Copy Storybook build from build stage
    COPY --from=build /app/node_modules/@my/core/storybook-static ./storybook-static
    
    EXPOSE 5001
    
    CMD ["http-server", "storybook-static", "-p", "5001"]
    