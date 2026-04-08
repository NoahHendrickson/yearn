import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
}

const SIZE_KEYS = ['size', 'sz', 'variant_size', 'selected_size']
const COLOR_KEYS = ['color', 'colour', 'color_name', 'variant_color', 'selected_color', 'shade']

// ── Helpers ──────────────────────────────────────────────────────────────────

function getMeta(html: string, name: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${name}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'),
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m?.[1]) return m[1].trim()
  }
  return ''
}

function getTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return m?.[1]?.trim() ?? ''
}

function getJsonLdImage(html: string): string {
  const scriptRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = scriptRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(m[1])
      const nodes = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data]
      for (const node of nodes) {
        // Product or ItemPage JSON-LD
        const type = node['@type'] ?? ''
        if (/product|offer/i.test(type)) {
          const img = node.image
          if (typeof img === 'string') return img
          if (Array.isArray(img) && img[0]) return typeof img[0] === 'string' ? img[0] : img[0].url ?? ''
          if (img?.url) return img.url
        }
      }
    } catch {
      // malformed JSON-LD — skip
    }
  }
  return ''
}

function parseUrlParams(url: string): { size: string; color: string } {
  let size = ''
  let color = ''
  try {
    const u = new URL(url)
    u.searchParams.forEach((val, key) => {
      const lower = key.toLowerCase()
      if (!size && SIZE_KEYS.some((k) => lower.includes(k))) size = val
      if (!color && COLOR_KEYS.some((k) => lower.includes(k))) color = val
    })
  } catch { /* ignore */ }
  return { size, color }
}

function absoluteUrl(src: string, base: string): string {
  try {
    return new URL(src, base).href
  } catch {
    return src
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { url } = await req.json()
    if (!url) return json({ error: 'url is required' }, 400)

    const { size, color } = parseUrlParams(url)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    let res: Response
    try {
      res = await fetch(url, { headers: BROWSER_HEADERS, redirect: 'follow', signal: controller.signal })
    } finally {
      clearTimeout(timeout)
    }
    if (!res.ok) return json({ error: `Fetch failed: ${res.status}` }, 502)

    // Read only the first 150KB — <head> meta tags and JSON-LD are always there
    const MAX_BYTES = 150_000
    let html = ''
    let bytesRead = 0
    const decoder = new TextDecoder()
    const reader = res.body?.getReader()
    if (reader) {
      try {
        while (bytesRead < MAX_BYTES) {
          const { done, value } = await reader.read()
          if (done) break
          html += decoder.decode(value, { stream: true })
          bytesRead += value.byteLength
        }
      } finally {
        reader.cancel()
      }
    }

    const finalUrl = res.url // after redirects

    // Title: og:title > twitter:title > <title>
    const name =
      getMeta(html, 'og:title') ||
      getMeta(html, 'twitter:title') ||
      getTitle(html)

    // Description
    const description =
      getMeta(html, 'og:description') ||
      getMeta(html, 'twitter:description') ||
      getMeta(html, 'description')

    // Image: JSON-LD Product > og:image:secure_url > og:image > twitter:image:src > twitter:image
    const rawImage =
      getJsonLdImage(html) ||
      getMeta(html, 'og:image:secure_url') ||
      getMeta(html, 'og:image') ||
      getMeta(html, 'twitter:image:src') ||
      getMeta(html, 'twitter:image')

    const imageUrl = rawImage ? absoluteUrl(rawImage, finalUrl) : ''

    return json({ name, description, imageUrl, size, color })
  } catch (err) {
    return json({ error: String(err) }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}
