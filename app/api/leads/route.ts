import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type LeadPayload = {
  company?: string;
  website?: string;
  product?: string;
  market?: string;
  problem?: string;
  contactName?: string;
  email?: string;
  messenger?: string;
  note?: string;
};

const requiredFields: Array<keyof LeadPayload> = [
  'company',
  'website',
  'product',
  'market',
  'problem',
  'contactName',
  'email'
];

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;

    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim().length === 0) {
        return NextResponse.json({ message: '请填写所有必填字段。' }, { status: 400 });
      }
    }

    if (!isValidUrl(String(body.website))) {
      return NextResponse.json({ message: '官网链接格式不正确。' }, { status: 400 });
    }

    if (!isValidEmail(String(body.email))) {
      return NextResponse.json({ message: '邮箱格式不正确。' }, { status: 400 });
    }

    const lead = {
      submittedAt: new Date().toISOString(),
      status: '新提交',
      company: String(body.company).trim(),
      website: String(body.website).trim(),
      product: String(body.product).trim(),
      market: String(body.market).trim(),
      problem: String(body.problem).trim(),
      contactName: String(body.contactName).trim(),
      email: String(body.email).trim(),
      messenger: body.messenger ? String(body.messenger).trim() : '',
      note: body.note ? String(body.note).trim() : ''
    };

    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    await fs.appendFile(path.join(dataDir, 'leads.jsonl'), `${JSON.stringify(lead)}\n`, 'utf8');

    return NextResponse.json({ ok: true, message: '提交成功。' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '服务器处理失败，请稍后再试。' }, { status: 500 });
  }
}
