import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, scoreFromAudit } from '../../../lib/toolUtils';

export async function POST(req: Request) {
  try {
    const { myDomain, competitorDomainA, competitorDomainB } = await req.json();
    const myUrl = normalizeUrl(myDomain);
    const aUrl = normalizeUrl(competitorDomainA);
    const bUrl = competitorDomainB ? normalizeUrl(competitorDomainB) : '';
    if (!isValidHttpUrl(myUrl) || !isValidHttpUrl(aUrl) || (bUrl && !isValidHttpUrl(bUrl))) return NextResponse.json({ error: 'Invalid domain url.' }, { status: 400 });
    const audits = await Promise.all([runBasicSeoAudit(myUrl), runBasicSeoAudit(aUrl), bUrl ? runBasicSeoAudit(bUrl) : Promise.resolve(null)]);
    const myScore = scoreFromAudit(audits[0]!.basicSeoData);
    const competitorScores = [audits[1], audits[2]].filter(Boolean).map((a) => scoreFromAudit((a as NonNullable<typeof audits[1]>).basicSeoData));
    const avgCompetitor = Math.round(competitorScores.reduce((n, s) => n + s, 0) / competitorScores.length);
    return NextResponse.json({
      keywordGapEstimate: Math.max(0, (avgCompetitor - myScore) * 4),
      contentGap: audits[0]!.basicSeoData.textWordCount < audits[1]!.basicSeoData.textWordCount ? 'Competitors likely have deeper content coverage' : 'Content depth is competitive',
      landingPageGap: myScore < avgCompetitor ? 'Need more intent-specific landing pages' : 'Landing page structure is acceptable',
      ctaGap: audits[0]!.basicSeoData.h1.length ? 'Moderate' : 'High',
      technicalGap: audits[0]!.basicSeoData.sitemapXml.exists && audits[0]!.basicSeoData.robotsTxt.exists ? 'Low' : 'Medium',
      priorityActions: ['Expand high-intent pages', 'Strengthen internal links', 'Improve meta + heading consistency'],
      notice: 'AI estimate / simulated preview only. Not real Semrush / GA4 / GSC data.'
    });
  } catch {
    return NextResponse.json({ error: 'Analysis failed.', notice: 'AI estimate / simulated preview only.' }, { status: 500 });
  }
}
