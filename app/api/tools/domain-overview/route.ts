import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, scoreFromAudit } from '../../../lib/toolUtils';

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    const url = normalizeUrl(domain);
    if (!isValidHttpUrl(url)) return NextResponse.json({ error: 'Invalid domain url.' }, { status: 400 });
    const { basicSeoData } = await runBasicSeoAudit(url);
    return NextResponse.json({
      seoHealthScore: scoreFromAudit(basicSeoData),
      titleStatus: basicSeoData.title ? 'present' : 'missing',
      descriptionStatus: basicSeoData.metaDescription ? 'present' : 'missing',
      h1Status: basicSeoData.h1.length > 0 ? 'present' : 'missing',
      imagesWithoutAlt: basicSeoData.imagesWithoutAlt,
      https: basicSeoData.https,
      robotsTxt: basicSeoData.robotsTxt.exists,
      sitemapXml: basicSeoData.sitemapXml.exists,
      internalLinksEstimate: Math.round(basicSeoData.linkCount * 0.78),
      externalLinksEstimate: Math.round(basicSeoData.linkCount * 0.22),
      wordCount: basicSeoData.textWordCount,
      notice: 'AI estimate / simulated preview only. Not real Semrush / GA4 / GSC data.'
    });
  } catch {
    return NextResponse.json({ error: 'Analysis failed.', notice: 'AI estimate / simulated preview only.' }, { status: 500 });
  }
}
