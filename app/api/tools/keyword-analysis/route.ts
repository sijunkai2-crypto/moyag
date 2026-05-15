import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, topKeywords } from '../../../lib/toolUtils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = normalizeUrl(body.domain || '');
    const product = String(body.product || body.industry || '').trim();
    if (!isValidHttpUrl(url)) return NextResponse.json({ message: 'Invalid domain.' }, { status: 400 });
    const { pageText } = await runBasicSeoAudit(url);
    const core = topKeywords(pageText, 8);
    const buyer = core.slice(0, 4).map((k) => `${k} supplier`);
    const longTail = core.slice(2, 7).map((k) => `${product || 'b2b'} ${k} for ${String(body.targetMarket || 'global market')}`);
    return NextResponse.json({
      result: {
        coreKeywords: core,
        buyerIntentKeywords: buyer,
        longTailKeywords: longTail,
        missingKeywordClusters: ['comparison', 'pricing', 'case study', 'technical specs'],
        blogTopicSuggestions: core.slice(0, 4).map((k) => `How to choose ${k} for B2B buyers`)
      },
      notice: 'AI estimate / simulated preview. Connect GSC/GA4 or third-party SEO data later for real production metrics.'
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
