const isGithubPagesExport = process.env.NEXT_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isGithubPagesExport
    ? {
        output: "export",
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
        assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",
        images: { unoptimized: true },
        trailingSlash: true
      }
    : {})
};

export default nextConfig;
