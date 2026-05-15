import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, scoreFromAudit } from '../../../lib/toolUtils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const myDomain = normalizeUrl(body.myDomain || '');
    const compA = normalizeUrl(body.competitorDomainA || '');
    const compB = normalizeUrl(body.competitorDomainB || '');
    if (!isValidHttpUrl(myDomain) || !isValidHttpUrl(compA)) return NextResponse.json({ message: 'Invalid domain.' }, { status: 400 });
    const tasks = [runBasicSeoAudit(myDomain), runBasicSeoAudit(compA)];
    if (compB && isValidHttpUrl(compB)) tasks.push(runBasicSeoAudit(compB));
    const [mine, a, b] = await Promise.all(tasks);
    const myScore = scoreFromAudit(mine.basicSeoData);
    const compScores = [scoreFromAudit(a.basicSeoData), b ? scoreFromAudit(b.basicSeoData) : null].filter((v): v is number => v !== null);
    const avgComp = Math.round(compScores.reduce((x, y) => x + y, 0) / compScores.length);
    return NextResponse.json({
      result: {
        keywordGapEstimate: Math.max(0, avgComp - myScore + 18),
        contentGap: Math.max(0, (a.basicSeoData.textWordCount + (b?.basicSeoData.textWordCount || 0)) / compScores.length - mine.basicSeoData.textWordCount),
        landingPageGap: Math.max(0, Math.round((a.basicSeoData.h2.length + (b?.basicSeoData.h2.length || 0)) / compScores.length - mine.basicSeoData.h2.length)),
        ctaGap: 'Medium',
        technicalGap: myScore >= avgComp ? 'Low' : 'Medium-High',
        priorityActions: ['Expand buyer-intent content clusters', 'Strengthen CTA blocks above fold', 'Fix metadata and schema consistency']
      },
      notice: 'AI estimate / simulated preview.'
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
