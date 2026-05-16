import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, scoreFromAudit } from '../../../lib/toolUtils';

export async function POST(req: Request) {
  try {
    const { myDomain, competitorDomain } = await req.json();
    const myUrl = normalizeUrl(myDomain);
    const competitorUrl = normalizeUrl(competitorDomain);
    if (!isValidHttpUrl(myUrl) || !isValidHttpUrl(competitorUrl)) return NextResponse.json({ error: 'Invalid domain url.' }, { status: 400 });
    const [mine, comp] = await Promise.all([runBasicSeoAudit(myUrl), runBasicSeoAudit(competitorUrl)]);
    const myScore = scoreFromAudit(mine.basicSeoData);
    const compScore = scoreFromAudit(comp.basicSeoData);
    return NextResponse.json({
      my: { score: myScore, words: mine.basicSeoData.textWordCount, links: mine.basicSeoData.linkCount },
      competitor: { score: compScore, words: comp.basicSeoData.textWordCount, links: comp.basicSeoData.linkCount },
      winner: myScore >= compScore ? 'myDomain' : 'competitorDomain',
      missing: [mine.basicSeoData.h1.length ? null : 'H1 structure', mine.basicSeoData.sitemapXml.exists ? null : 'sitemap.xml', mine.basicSeoData.metaDescription ? null : 'meta description'].filter(Boolean),
      notice: 'AI estimate / simulated preview only. Not real Semrush / GA4 / GSC data.'
    });
  } catch {
    return NextResponse.json({ error: 'Analysis failed.', notice: 'AI estimate / simulated preview only.' }, { status: 500 });
  }
}
