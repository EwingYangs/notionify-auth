/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REDNOTE_CLIENT_ID: process.env.REDNOTE_CLIENT_ID,
    REDNOTE_CLIENT_SECRET: process.env.REDNOTE_CLIENT_SECRET,
    REDNOTE_REDIRECT_URL: process.env.REDNOTE_REDIRECT_URL,
    WEREAD_CLIENT_ID: process.env.WEREAD_CLIENT_ID,
    WEREAD_CLIENT_SECRET: process.env.WEREAD_CLIENT_SECRET,
    WEREAD_REDIRECT_URL: process.env.WEREAD_REDIRECT_URL,
    FLOMO_CLIENT_ID: process.env.FLOMO_CLIENT_ID,
    FLOMO_CLIENT_SECRET: process.env.FLOMO_CLIENT_SECRET,
    FLOMO_REDIRECT_URL: process.env.FLOMO_REDIRECT_URL,
    JIKE_CLIENT_ID: process.env.JIKE_CLIENT_ID,
    JIKE_CLIENT_SECRET: process.env.JIKE_CLIENT_SECRET,
    JIKE_REDIRECT_URL: process.env.JIKE_REDIRECT_URL,
    BILI_CLIENT_ID: process.env.BILI_CLIENT_ID,
    BILI_CLIENT_SECRET: process.env.BILI_CLIENT_SECRET,
    BILI_REDIRECT_URL: process.env.BILI_REDIRECT_URL,
  }
}

module.exports = nextConfig 