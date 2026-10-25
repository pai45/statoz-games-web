import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  async headers() {return [{source:'/play/open-golf/:path*',headers:[{key:'Cross-Origin-Opener-Policy',value:'same-origin'},{key:'Cross-Origin-Embedder-Policy',value:'require-corp'}]}];},
  // Device caching serves the original image URL in every deployment mode.
  images: { unoptimized: true },
  ...(isGitHubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
      }
    : {}),
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
