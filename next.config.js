/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  // basePath: '92.168.17.128:3000',
  env: {
    URL: process.env.URL_GRAPHQL || process.env.URL || 'http://beee-graphql/graphql',
    // AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || 'http://dev-auth.hexabase.com'
  },
}
