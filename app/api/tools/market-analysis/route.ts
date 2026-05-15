import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, scoreFromAudit } from '../../../lib/toolUtils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = normalizeUrl(body.domain || '');
    const industry = String(body.industry || 'B2B');
    const targetMarket = String(body.targetMarket || 'Global');
    if (!isValidHttpUrl(url)) return NextResponse.json({ message: 'Invalid domain.' }, { status: 400 });
    const { basicSeoData } = await runBasicSeoAudit(url);
    const score = scoreFromAudit(basicSeoData);
    return NextResponse.json({
      result: {
        marketFitScore: `${Math.min(98, score + 5)}/100`,
        buyerSearchIntent: [`${industry} supplier`, `${industry} manufacturer`, `${industry} quote`],
        contentStrategy: ['Create intent-based landing pages', 'Publish region-specific case studies', 'Add stronger CTA blocks'],
        regionalSeoSuggestions: [`Localize for ${targetMarket} search terms`, 'Use hreflang and regional schema', 'Build regional backlinks'],
        channelSuggestions: ['Google SEO', 'LinkedIn content', 'B2B marketplace pages'],
        growthPlan30Days: ['Week1: fix metadata and technical issues', 'Week2: publish 2 buyer intent pages', 'Week3: improve conversion sections', 'Week4: launch outreach and link building']
      },
      notice: 'AI estimate / simulated preview. Connect GSC/GA4 or third-party SEO data later for real production metrics.'
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
