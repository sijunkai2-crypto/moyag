import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, scoreFromAudit } from '../../../lib/toolUtils';

export async function POST(req: Request) {
  try {
    const { domain, industry, targetMarket } = await req.json();
    const url = normalizeUrl(domain);
    if (!isValidHttpUrl(url)) return NextResponse.json({ error: 'Invalid domain url.' }, { status: 400 });
    const { basicSeoData } = await runBasicSeoAudit(url);
    const score = scoreFromAudit(basicSeoData);
    return NextResponse.json({
      marketFitScore: score,
      buyerSearchIntent: [`${industry || 'industry'} pricing`, `${industry || 'industry'} solution`, `${industry || 'industry'} supplier`],
      contentStrategy: ['Product pillar page', 'Use-case landing pages', 'Case studies by segment'],
      regionalSeoSuggestions: [`Create localized pages for ${targetMarket || 'priority market'}`, 'Add hreflang and local proof points'],
      channelSuggestions: ['SEO + LinkedIn content', 'Industry communities', 'Partner co-marketing'],
      growthPlan30Days: ['Week 1: keyword map', 'Week 2: top 3 pages rewrite', 'Week 3: publish 2 blogs', 'Week 4: CTA A/B test'],
      notice: 'AI estimate / simulated preview only. Not real Semrush / GA4 / GSC data.'
    });
  } catch {
    return NextResponse.json({ error: 'Analysis failed.', notice: 'AI estimate / simulated preview only.' }, { status: 500 });
  }
}
