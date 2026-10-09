import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  transpilePackages: [
    "@mythrart/constants",
    "@mythrart/database",
    "@mythrart/editor-extensions",
    "@mythrart/env",
    "@mythrart/redis",
    "@mythrart/s3",
    "@mythrart/validations",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default withNextIntl(nextConfig)
