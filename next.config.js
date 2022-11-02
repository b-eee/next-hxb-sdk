/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  // basePath: '92.168.17.128:3000',
  env: {
    URL: process.env.URL_GRAPHQL || process.env.URL || 'https://hxb-graph.hexabase.com/graphql',
    // AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || 'http://dev-auth.hexabase.com'
  },
}
