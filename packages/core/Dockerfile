# --- Build Stage ---
    FROM node:18.18.0-alpine AS build

    ARG NEXUS_USER
    ARG NEXUS_PASSWORD_BASE64
    
    WORKDIR /app
    
    # Setup .npmrc manually during build
    RUN echo "registry=https://3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/" > .npmrc && \
    echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:username=${NEXUS_USER}" >> .npmrc && \
    echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:_password=${NEXUS_PASSWORD_BASE64}" >> .npmrc && \
    echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:email=subravjadhav@gmail.com" >> .npmrc && \
    echo "//3447-2409-4090-2043-1c16-c457-863d-80c9-57a2.ngrok-free.app/repository/Ds-Monorepo/:always-auth=true" >> .npmrc

    
    # Copy the entire monorepo setup
    COPY package.json ./
    COPY yarn.lock ./
    COPY .yarnrc.yml ./
    COPY .yarn ./.yarn
    COPY packages ./packages
    
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
    