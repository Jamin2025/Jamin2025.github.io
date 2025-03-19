import { NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer2';

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let assetPrefix = "";
let basePath = "";

if (isGithubActions) {
  // 去掉 `<owner>/`
  const repo = process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");

  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

const nextConfig: NextConfig = {
  assetPrefix,
  basePath,
  reactStrictMode: true,
  output: "export"
};

export default withContentlayer(nextConfig);
