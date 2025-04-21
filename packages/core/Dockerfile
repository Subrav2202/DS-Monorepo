# --- Build Stage ---
    FROM node:18.18.0-alpine AS build

    ARG NEXUS_USER
    ARG NEXUS_PASSWORD_BASE64
    
    WORKDIR /app
    
    RUN apk add --no-cache bash curl coreutils
    
    # Decode Nexus password and set up .npmrc
    RUN NEXUS_PASSWORD=$(echo "$NEXUS_PASSWORD_BASE64" | base64 -d) && \
        echo "registry=https://3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/" > .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:username=${NEXUS_USER}" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:_password=${NEXUS_PASSWORD}" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:email=dummy@email.com" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:always-auth=true" >> .npmrc
    
    # Download and add the core package
    RUN curl -L https://3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/@my/core/-/core-1.0.0.tgz -o core-1.0.0.tgz && \
        yarn add ./core-1.0.0.tgz
    
    # Install dependencies
    RUN yarn install --frozen-lockfile
    
    # Build Storybook
    WORKDIR /app/node_modules/@my/core
    RUN yarn build-storybook
    
    # --- Release Stage ---
    FROM node:18.18.0-alpine AS release
    
    WORKDIR /app
    
    RUN yarn global add http-server
    
    # Copy Storybook to release image
    COPY --from=build /app/node_modules/@my/core/storybook-static ./storybook-static
    
    EXPOSE 5001
    
    CMD ["http-server", "storybook-static", "-p", "5001"]
    