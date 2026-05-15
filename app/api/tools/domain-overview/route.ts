import { NextResponse } from 'next/server';
import { runBasicSeoAudit } from '../../../lib/basicSeoAudit';
import { isValidHttpUrl, normalizeUrl, scoreFromAudit } from '../../../lib/toolUtils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = normalizeUrl(body.domain || '');
    if (!isValidHttpUrl(url)) return NextResponse.json({ message: 'Invalid domain.' }, { status: 400 });
    const { basicSeoData } = await runBasicSeoAudit(url);
    const result = {
      seoHealthScore: scoreFromAudit(basicSeoData),
      titleStatus: basicSeoData.title ? 'OK' : 'Missing',
      descriptionStatus: basicSeoData.metaDescription ? 'OK' : 'Missing',
      h1Status: basicSeoData.h1.length ? 'OK' : 'Missing',
      imagesWithoutAlt: basicSeoData.imagesWithoutAlt,
      https: basicSeoData.https,
      robotsTxt: basicSeoData.robotsTxt.exists,
      sitemapXml: basicSeoData.sitemapXml.exists,
      internalLinksEstimate: Math.max(0, basicSeoData.linkCount - Math.min(6, Math.floor(basicSeoData.linkCount / 4))),
      externalLinksEstimate: Math.min(6, Math.floor(basicSeoData.linkCount / 4)),
      wordCount: basicSeoData.textWordCount
    };
    return NextResponse.json({ result, notice: 'AI estimate / simulated preview.' });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
