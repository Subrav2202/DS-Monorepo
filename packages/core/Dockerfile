# --- Build Stage ---
    FROM node:18.18.0-alpine AS build

    ARG NEXUS_USER
    ARG NEXUS_PASSWORD_BASE64
    
    WORKDIR /app
    
    RUN apk add --no-cache bash curl
    
    # Install Yarn 4
    RUN corepack enable && corepack prepare yarn@4.1.1 --activate
    
    # Configure .npmrc for Nexus
    RUN apk add --no-cache bash curl coreutils && \
        NEXUS_PASSWORD=$(echo "$NEXUS_PASSWORD_BASE64" | base64 -d) && \
        echo "registry=https://3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/" > .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:username=${NEXUS_USER}" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:_password=${NEXUS_PASSWORD}" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:email=dummy@email.com" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:always-auth=true" >> .npmrc && \

    
    # Add core package directly from Nexus
    RUN curl -L https://3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/@my/core/-/core-1.0.0.tgz -o core-1.0.0.tgz && \
    yarn add ./core-1.0.0.tgz

    
    # Install dependencies for @my/core (inside node_modules)
    RUN yarn install --frozen-lockfile
    
    # Change to the package directory to build Storybook
    WORKDIR /app/node_modules/@my/core
    RUN yarn build-storybook
    
    # --- Release Stage ---
    FROM node:18.18.0-alpine AS release
    
    WORKDIR /app
    
    # Install http-server globally
    RUN yarn global add http-server
    
    # Copy built Storybook from build stage
    COPY --from=build /app/node_modules/@my/core/storybook-static ./storybook-static
    
    EXPOSE 5001
    
    CMD ["http-server", "storybook-static", "-p", "5001"]
    