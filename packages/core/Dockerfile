# --- Build Stage ---
    FROM node:18.18.0-alpine AS build

    ARG NEXUS_USER
    ARG NEXUS_PASSWORD_BASE64
    ARG PACKAGE_VERSION=1.0.0
    
    WORKDIR /app
    
    # Setup .npmrc with Nexus credentials
    RUN echo "registry=https://your-nexus-url/repository/Ds-Monorepo/" > .npmrc && \
        echo "//your-nexus-url/repository/Ds-Monorepo/:username=${NEXUS_USER}" >> .npmrc && \
        echo "//your-nexus-url/repository/Ds-Monorepo/:_password=${NEXUS_PASSWORD_BASE64}" >> .npmrc && \
        echo "//your-nexus-url/repository/Ds-Monorepo/:email=dummy@email.com" >> .npmrc && \
        echo "//your-nexus-url/repository/Ds-Monorepo/:always-auth=true" >> .npmrc
    
    # Download and install the .tgz package from Nexus
    RUN yarn add https://your-nexus-url/repository/Ds-Monorepo/@my/core/-/core-${PACKAGE_VERSION}.tgz
    
    # Change working dir to the installed package location
    WORKDIR /app/node_modules/@my/core
    
    # Build Storybook
    RUN yarn build-storybook
    
    # --- Release Stage ---
    FROM node:18.18.0-alpine AS release
    
    WORKDIR /app
    
    RUN yarn global add http-server
    
    # Copy built Storybook
    COPY --from=build /app/node_modules/@my/core/storybook-static ./storybook-static
    
    EXPOSE 5001
    
    CMD ["http-server", "storybook-static", "-p", "5001"]
    