/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'www.notion.so',
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com'
    ]
  },
  env: {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    NOTION_ROOMS_DB_ID: process.env.NOTION_ROOMS_DB_ID,
    NOTION_JOURNAL_DB_ID: process.env.NOTION_JOURNAL_DB_ID,
    NOTION_PLANS_DB_ID: process.env.NOTION_PLANS_DB_ID,
    NOTION_STORIES_DB_ID: process.env.NOTION_STORIES_DB_ID,
    NOTION_EXPERIENCES_DB_ID: process.env.NOTION_EXPERIENCES_DB_ID,
  }
}

module.exports = nextConfig