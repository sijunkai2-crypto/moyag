import { runBasicSeoAudit } from './basicSeoAudit';

export function normalizeUrl(input: string) {
  const raw = String(input || '').trim();
  if (!raw) return '';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

export function isValidHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function tokenize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
}

export function topKeywords(text: string, limit = 12) {
  const stop = new Set(['the', 'and', 'for', 'with', 'you', 'your', 'from', 'that', 'this', 'are', 'our', 'seo', 'www', 'com']);
  const freq = new Map<string, number>();
  for (const w of tokenize(text)) {
    if (stop.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([k]) => k);
}

export function scoreFromAudit(audit: Awaited<ReturnType<typeof runBasicSeoAudit>>['basicSeoData']) {
  let score = 100;
  if (!audit.title) score -= 12;
  if (!audit.metaDescription) score -= 10;
  if (!audit.h1.length) score -= 10;
  if (!audit.https) score -= 15;
  if (!audit.robotsTxt.exists) score -= 8;
  if (!audit.sitemapXml.exists) score -= 8;
  score -= Math.min(20, audit.imagesWithoutAlt * 2);
  if (audit.textWordCount < 250) score -= 8;
  return Math.max(25, Math.min(100, score));
}
