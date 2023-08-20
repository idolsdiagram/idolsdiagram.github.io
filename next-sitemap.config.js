/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.SITE_URL || 'http://127.0.0.1:3000',
    generateRobotsTxt: true,
    sitemapSize: 7000,
    outDir: './out'
};