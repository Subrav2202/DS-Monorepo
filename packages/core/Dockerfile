# --- Build Stage ---
    FROM node:18.18.0-alpine AS build

    ARG NEXUS_USER
    ARG NEXUS_PASSWORD_BASE64
    
    WORKDIR /app
    
    # Install yarn globally using apk (Alpine package manager)
    RUN apk add --no-cache bash curl && \
        curl -o- -L https://yarnpkg.com/install.sh | bash
    
    # Ensure yarn is installed correctly
    RUN yarn --version
    
    # Setup .npmrc with Nexus credentials
    RUN echo "registry=https://3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/" > .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:username=${NEXUS_USER}" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:_password=${NEXUS_PASSWORD_BASE64}" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:email=dummy@email.com" >> .npmrc && \
        echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:always-auth=true" >> .npmrc
    
    # Download and install the .tgz package from Nexus
    RUN yarn add https://3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/@my/core/-/core-1.0.0.tgz
    
    # Install dependencies for Storybook (if they are not already in the .tgz)
    WORKDIR /app
    RUN yarn install --frozen-lockfile --verbose
    
    # Change working dir to the installed package location
    WORKDIR /app/node_modules/@my/core
    
    # Build Storybook
    RUN yarn build-storybook
    
    # --- Release Stage ---
    FROM node:18.18.0-alpine AS release
    
    WORKDIR /app
    
    # Install http-server to serve Storybook
    RUN yarn global add http-server
    
    # Copy built Storybook from build stage
    COPY --from=build /app/node_modules/@my/core/storybook-static ./storybook-static
    
    EXPOSE 5001
    
    # Serve Storybook
    CMD ["http-server", "storybook-static", "-p", "5001"]
    