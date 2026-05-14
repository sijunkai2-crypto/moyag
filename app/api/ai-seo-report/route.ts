import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateAiSeoReport } from '../../lib/aiSeoReport';
import { runBasicSeoAudit } from '../../lib/basicSeoAudit';

type RequestBody = {
  url?: string;
  industry?: string;
  targetMarket?: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
};

function isValidUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const url = String(body.url || '').trim();
    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ message: 'URL 格式不正确。' }, { status: 400 });
    }

    const timed = new Promise(async (resolve, reject) => {
      try {
        const { basicSeoData, pageText } = await runBasicSeoAudit(url);
        const aiReport = await generateAiSeoReport({
          url,
          industry: String(body.industry || ''),
          targetMarket: String(body.targetMarket || ''),
          basicSeoData,
          pageText
        });

        const row = {
          createdAt: new Date().toISOString(),
          url,
          companyName: body.companyName || '',
          contactName: body.contactName || '',
          phone: body.phone || '',
          email: body.email || '',
          industry: body.industry || '',
          targetMarket: body.targetMarket || '',
          seoScore: aiReport.score,
          riskLevel: aiReport.riskLevel,
          aiReport,
          rawSeoData: basicSeoData
        };

        const dataDir = path.join(process.cwd(), 'data');
        await fs.mkdir(dataDir, { recursive: true });
        await fs.appendFile(path.join(dataDir, 'leads.jsonl'), `${JSON.stringify(row)}\n`, 'utf8');

        resolve(NextResponse.json({ success: true, basicSeoData, aiReport }));
      } catch (e) {
        reject(e);
      }
    });

    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('处理超时，请稍后重试。')), 30000));
    return (await Promise.race([timed, timeout])) as NextResponse;
  } catch (error) {
    const message = error instanceof Error ? error.message : '服务异常';
    return NextResponse.json({ message }, { status: 500 });
  }
}
