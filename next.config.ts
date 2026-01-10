import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

export default withSentryConfig(nextConfig, {
    org: "security-360",
    project: "security-360-pay",
    silent: true,
});
