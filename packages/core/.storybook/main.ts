// .storybook/main.ts
import type { StorybookConfig } from "@storybook/nextjs";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  staticDirs: ["./public"],
  addons: [
    {
      name: "@storybook/addon-essentials",
      options: {
        docs: false,
      },
    },
    "@storybook/addon-links",
    "@storybook/addon-designs",
    "@storybook/addon-knobs",
    {
      name: "@storybook/addon-styling-webpack",
      options: {},
    },
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  core: {
    disableTelemetry: true,
  },
  webpackFinal: async (config) => {
    // Exclude .svg from existing image rule
    const imageRule = config.module?.rules?.find((rule) =>
      rule?.["test"]?.test?.(".svg")
    );
    if (imageRule) {
      imageRule["exclude"] = /\.svg$/;
    }

    // Inline SVGs
    config.module?.rules?.push({
      test: /\.svg$/,
      type: "asset/inline",
    });
    return config;
  },
};

export default config;
