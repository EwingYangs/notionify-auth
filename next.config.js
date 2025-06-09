/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REDNOTE_CLIENT_ID: process.env.REDNOTE_CLIENT_ID,
    REDNOTE_CLIENT_SECRET: process.env.REDNOTE_CLIENT_SECRET,
    REDNOTE_REDIRECT_URL: process.env.REDNOTE_REDIRECT_URL,
  }
}

module.exports = nextConfig 