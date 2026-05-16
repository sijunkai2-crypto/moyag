import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, topKeywords } from '../../../lib/toolUtils';

export async function POST(req: Request) {
  try {
    const { domain, product, industry } = await req.json();
    const url = normalizeUrl(domain);
    if (!isValidHttpUrl(url)) return NextResponse.json({ error: 'Invalid domain url.' }, { status: 400 });
    const { pageText } = await runBasicSeoAudit(url);
    const seed = (product || industry || 'service').toLowerCase();
    const core = topKeywords(pageText, 8);
    return NextResponse.json({
      coreKeywords: core,
      buyerIntentKeywords: [`best ${seed}`, `${seed} pricing`, `${seed} supplier`, `${seed} company`],
      longTailKeywords: core.slice(0, 5).map((k) => `${k} for b2b teams`),
      missingKeywordClusters: ['comparison pages', 'case-study terms', 'location + intent terms'],
      blogTopicSuggestions: core.slice(0, 4).map((k) => `How to improve ${k} strategy in 2026`),
      notice: 'AI estimate / simulated preview only. Not real Semrush / GA4 / GSC data.'
    });
  } catch {
    return NextResponse.json({ error: 'Analysis failed.', notice: 'AI estimate / simulated preview only.' }, { status: 500 });
  }
}
