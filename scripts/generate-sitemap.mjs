import fs from 'fs'
import path from 'path'
import { posts } from '../src/data/posts.generated.js'

const SITE_URL = (process.env.SITE_URL || 'https://www.jiamingliu.com').replace(/\/+$/, '')
const OUTPUT_PATH = path.resolve('public', 'sitemap.xml')

const isoFromDate = (value) => {
  if (!value) return null
  const normalized = value.toString().replace(/\./g, '-')
  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const todayIso = new Date().toISOString()

const staticRoutes = ['/', '/posts', '/notes', '/tags'].map((route) => ({
  loc: `${SITE_URL}/#${route}`,
  lastmod: todayIso,
}))

const postRoutes = posts.map((post) => ({
  loc: `${SITE_URL}/#/posts/${post.id}`,
  lastmod: isoFromDate(post.date) || todayIso,
}))

const urls = Array.from(new Set([...staticRoutes, ...postRoutes].map((u) => JSON.stringify(u))))
  .map((s) => JSON.parse(s))

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
fs.writeFileSync(OUTPUT_PATH, xml.trim() + '\n', 'utf8')
console.log(`Generated sitemap with ${urls.length} entries at ${path.relative(process.cwd(), OUTPUT_PATH)}`)
