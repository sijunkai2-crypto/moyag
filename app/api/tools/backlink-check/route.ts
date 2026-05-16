import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl } from '../../../lib/toolUtils';

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    const url = normalizeUrl(domain);
    if (!isValidHttpUrl(url)) return NextResponse.json({ error: 'Invalid domain url.' }, { status: 400 });
    const { basicSeoData, pageText } = await runBasicSeoAudit(url);
    const socialPlatformSignals = ['linkedin', 'facebook', 'youtube', 'x.com', 'twitter.com'].filter((p) => pageText.toLowerCase().includes(p));
    return NextResponse.json({
      externalLinkCount: Math.round(basicSeoData.linkCount * 0.22),
      socialPlatformSignals,
      linkRiskEstimate: basicSeoData.https ? 'Low to Medium' : 'Medium to High',
      linkBuildingSuggestions: ['Publish comparison pages', 'Submit industry directories', 'Launch digital PR assets'],
      notice: 'AI estimate / simulated preview only. Full backlink database requires third-party SEO data provider later.'
    });
  } catch {
    return NextResponse.json({ error: 'Analysis failed.', notice: 'AI estimate / simulated preview only.' }, { status: 500 });
  }
}
