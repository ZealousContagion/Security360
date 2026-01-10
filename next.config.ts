import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
});

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

export default withSentryConfig(
    withPWA(nextConfig),
    {
        org: "security-360",
        project: "security-360-pay",
        silent: true,
    }
);