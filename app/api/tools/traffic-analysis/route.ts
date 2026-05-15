import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, scoreFromAudit } from '../../../lib/toolUtils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = normalizeUrl(body.domain || '');
    const targetMarket = String(body.targetMarket || 'Global');
    if (!isValidHttpUrl(url)) return NextResponse.json({ message: 'Invalid domain.' }, { status: 400 });
    const { basicSeoData, pageText } = await runBasicSeoAudit(url);
    const seoScore = scoreFromAudit(basicSeoData);
    const ctaSignals = (pageText.match(/contact|quote|demo|buy|order|whatsapp|email/gi) || []).length;
    const trafficPotential = Math.min(100, Math.round(seoScore * 0.7 + Math.min(30, basicSeoData.textWordCount / 40)));
    return NextResponse.json({
      result: {
        trafficPotential: `${trafficPotential}/100`,
        contentCoverage: `${Math.min(95, Math.round(basicSeoData.textWordCount / 12))}%`,
        entryPageOpportunity: Math.max(8, Math.round(basicSeoData.h2.length * 1.8)),
        conversionReadiness: `${Math.min(95, 35 + ctaSignals * 8)}%`,
        riskSignals: seoScore > 80 ? 'Low' : seoScore > 60 ? 'Medium' : 'High',
        targetMarket
      },
      notice: 'AI estimate / simulated preview. Not real GA4 data.'
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
