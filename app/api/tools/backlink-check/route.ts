import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl } from '../../../lib/toolUtils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = normalizeUrl(body.domain || '');
    if (!isValidHttpUrl(url)) return NextResponse.json({ message: 'Invalid domain.' }, { status: 400 });
    const { basicSeoData, pageText } = await runBasicSeoAudit(url);
    const socialSignals = (pageText.match(/linkedin|facebook|youtube|x.com|twitter|instagram|wechat/gi) || []).length;
    const platformSignals = (pageText.match(/alibaba|made-in-china|amazon|globalsources|1688/gi) || []).length;
    return NextResponse.json({
      result: {
        externalLinkCount: Math.min(10, Math.floor(basicSeoData.linkCount / 3)),
        socialPlatformSignals: socialSignals + platformSignals,
        linkRiskEstimate: basicSeoData.https ? 'Low-Medium' : 'Medium-High',
        linkBuildingSuggestions: ['Publish industry case studies for natural mentions', 'Build partner listing links in niche directories', 'Strengthen social profile backlinks']
      },
      notice: 'AI estimate / simulated preview. Full backlink database requires third-party SEO data provider later.'
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
