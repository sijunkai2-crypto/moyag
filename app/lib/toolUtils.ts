import type { BasicSeoData } from './basicSeoAudit';

export function normalizeUrl(input: string): string {
  const trimmed = (input || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function topKeywords(pageText: string, limit = 10): string[] {
  const stop = new Set(['the','and','for','with','that','this','from','you','your','are','our','not','have','has','was','were','will','can','to','of','in','on','a','an','is','it','as','by','or','be','at','we','us','about','more','than','how']);
  const words = pageText.toLowerCase().match(/[a-z][a-z0-9-]{2,}/g) || [];
  const freq = new Map<string, number>();
  for (const w of words) if (!stop.has(w)) freq.set(w, (freq.get(w) || 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([w]) => w);
}

export function scoreFromAudit(audit: BasicSeoData): number {
  let score = 55;
  if (audit.https) score += 10;
  if (audit.title.length >= 20 && audit.title.length <= 65) score += 10;
  if (audit.metaDescription.length >= 70 && audit.metaDescription.length <= 170) score += 10;
  if (audit.h1.length > 0) score += 8;
  if (audit.robotsTxt.exists) score += 4;
  if (audit.sitemapXml.exists) score += 4;
  if (audit.textWordCount > 350) score += 5;
  if (audit.imageCount > 0) {
    const ratio = 1 - audit.imagesWithoutAlt / audit.imageCount;
    score += Math.round(Math.max(0, ratio * 8));
  }
  return Math.max(0, Math.min(100, score));
}
