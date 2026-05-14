export type BasicSeoData = {
  finalUrl: string;
  https: boolean;
  httpStatus: number;
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  h3: string[];
  imageCount: number;
  imagesWithoutAlt: number;
  linkCount: number;
  textWordCount: number;
  robotsTxt: { exists: boolean; status: number; url: string };
  sitemapXml: { exists: boolean; status: number; url: string };
};

const UA = 'Mozilla/5.0 (compatible; MoyagSeoAuditBot/3.0)';

function stripHtml(html: string) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getAllTagText(html: string, tag: string) {
  return [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
    .map((m) => stripHtml(m[1]))
    .filter(Boolean);
}

function getTagText(html: string, tag: string) {
  return getAllTagText(html, tag)[0] || '';
}

function getMetaDescription(html: string) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  for (const meta of metas) {
    const name = /name=["']([^"']+)["']/i.exec(meta)?.[1]?.toLowerCase();
    if (name === 'description') return /content=["']([^"']*)["']/i.exec(meta)?.[1] || '';
  }
  return '';
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal, headers: { 'user-agent': UA } });
  } finally {
    clearTimeout(timer);
  }
}

export async function runBasicSeoAudit(url: string): Promise<{ basicSeoData: BasicSeoData; pageText: string }> {
  const resp = await fetchWithTimeout(url, 12000);
  const html = await resp.text();
  const finalUrl = resp.url || url;
  const parsed = new URL(finalUrl);
  const origin = parsed.origin;

  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const imagesWithoutAlt = images.filter((img) => !/\balt\s*=\s*["'][^"']*["']/i.test(img)).length;
  const links = [...html.matchAll(/<a\b[^>]*href\s*=\s*["'][^"']+["'][^>]*>/gi)];
  const pageText = stripHtml(html);

  const [robotsResp, sitemapResp] = await Promise.all([
    fetchWithTimeout(`${origin}/robots.txt`, 6000).catch(() => null),
    fetchWithTimeout(`${origin}/sitemap.xml`, 6000).catch(() => null)
  ]);

  const basicSeoData: BasicSeoData = {
    finalUrl,
    https: parsed.protocol === 'https:',
    httpStatus: resp.status,
    title: getTagText(html, 'title'),
    metaDescription: getMetaDescription(html),
    h1: getAllTagText(html, 'h1'),
    h2: getAllTagText(html, 'h2'),
    h3: getAllTagText(html, 'h3'),
    imageCount: images.length,
    imagesWithoutAlt,
    linkCount: links.length,
    textWordCount: pageText.split(/\s+/).filter(Boolean).length,
    robotsTxt: { exists: !!robotsResp?.ok, status: robotsResp?.status || 0, url: `${origin}/robots.txt` },
    sitemapXml: { exists: !!sitemapResp?.ok, status: sitemapResp?.status || 0, url: `${origin}/sitemap.xml` }
  };

  return { basicSeoData, pageText };
}
