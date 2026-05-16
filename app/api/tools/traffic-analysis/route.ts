import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, scoreFromAudit } from '../../../lib/toolUtils';

export async function POST(req: Request) {
  try {
    const { domain, targetMarket } = await req.json();
    const url = normalizeUrl(domain);
    if (!isValidHttpUrl(url)) return NextResponse.json({ error: 'Invalid domain url.' }, { status: 400 });
    const { basicSeoData } = await runBasicSeoAudit(url);
    const score = scoreFromAudit(basicSeoData);
    return NextResponse.json({
      trafficPotential: score >= 75 ? 'High' : score >= 60 ? 'Medium' : 'Low',
      contentCoverage: `${Math.min(95, Math.max(20, Math.round(basicSeoData.textWordCount / 18)))}% estimated topical coverage`,
      entryPageOpportunity: basicSeoData.h2.slice(0, 5),
      conversionReadiness: basicSeoData.h1.length > 0 && basicSeoData.metaDescription ? 'Moderate to strong' : 'Needs CTA/page structure improvements',
      riskSignals: [basicSeoData.https ? null : 'No HTTPS', basicSeoData.imagesWithoutAlt > 5 ? 'High image alt gap' : null, basicSeoData.robotsTxt.exists ? null : 'Missing robots.txt'].filter(Boolean),
      targetMarket: targetMarket || 'Global',
      notice: 'AI estimate / simulated preview only. Not real Semrush / GA4 / GSC data.'
    });
  } catch {
    return NextResponse.json({ error: 'Analysis failed.', notice: 'AI estimate / simulated preview only.' }, { status: 500 });
  }
}
