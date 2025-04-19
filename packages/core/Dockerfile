# --- Build Stage ---
    FROM node:18.18.0-alpine AS build

    # Build ARG for Nexus auth (used in .npmrc)
    ARG NEXUS_TOKEN
    ENV NEXUS_TOKEN=$NEXUS_TOKEN
    
    WORKDIR /app
    
    # Copy minimal files first for cache efficiency
    COPY package.json yarn.lock .npmrc ./
    
    # Install dependencies
    RUN yarn install --frozen-lockfile --ignore-optional
    
    # Copy the rest of the files
    COPY . .
    
    # Build Storybook
    RUN yarn build-storybook
    
    # --- Release Stage ---
    FROM node:18.18.0-alpine AS release
    
    WORKDIR /app
    
    # Install a static server
    RUN yarn global add http-server
    
    # Copy static Storybook output only
    COPY --from=build /app/storybook-static ./storybook-static
    
    EXPOSE 5001
    
    CMD ["http-server", "storybook-static", "-p", "5001"]
    