import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, scoreFromAudit } from '../../../lib/toolUtils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const myDomain = normalizeUrl(body.myDomain || '');
    const competitorDomain = normalizeUrl(body.competitorDomain || '');
    if (!isValidHttpUrl(myDomain) || !isValidHttpUrl(competitorDomain)) return NextResponse.json({ message: 'Invalid domain.' }, { status: 400 });
    const [mine, comp] = await Promise.all([runBasicSeoAudit(myDomain), runBasicSeoAudit(competitorDomain)]);
    const myScore = scoreFromAudit(mine.basicSeoData);
    const compScore = scoreFromAudit(comp.basicSeoData);
    const cta = (t: string) => (t.match(/contact|quote|demo|buy|order|whatsapp|email/gi) || []).length;
    return NextResponse.json({
      result: {
        my: { title: !!mine.basicSeoData.title, description: !!mine.basicSeoData.metaDescription, h1: mine.basicSeoData.h1.length, wordCount: mine.basicSeoData.textWordCount, internalLinks: Math.max(0, mine.basicSeoData.linkCount - 4), externalLinks: Math.min(4, mine.basicSeoData.linkCount), ctaSignals: cta(mine.pageText), seoScore: myScore },
        competitor: { title: !!comp.basicSeoData.title, description: !!comp.basicSeoData.metaDescription, h1: comp.basicSeoData.h1.length, wordCount: comp.basicSeoData.textWordCount, internalLinks: Math.max(0, comp.basicSeoData.linkCount - 4), externalLinks: Math.min(4, comp.basicSeoData.linkCount), ctaSignals: cta(comp.pageText), seoScore: compScore },
        winner: myScore >= compScore ? 'My Domain' : 'Competitor Domain',
        missing: myScore >= compScore ? ['Improve conversion copy depth'] : ['Improve metadata quality', 'Increase keyword-rich content', 'Strengthen CTA signals']
      },
      notice: 'AI estimate / simulated preview.'
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
