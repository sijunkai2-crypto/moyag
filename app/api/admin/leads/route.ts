import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type Lead = {
  submittedAt: string;
  status: string;
  company: string;
  website: string;
  product: string;
  market: string;
  problem: string;
  contactName: string;
  email: string;
  messenger: string;
  note: string;
};

function isAuthorized(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = request.headers.get('x-admin-password');

  if (!adminPassword) return false;
  return providedPassword === adminPassword;
}

function parseLeadLine(line: string): Lead | null {
  try {
    return JSON.parse(line) as Lead;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: '密码错误或后台密码未配置。' }, { status: 401 });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'leads.jsonl');
    const content = await fs.readFile(filePath, 'utf8').catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return '';
      throw error;
    });

    const leads = content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map(parseLeadLine)
      .filter((lead): lead is Lead => Boolean(lead))
      .reverse();

    return NextResponse.json({ leads });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '读取线索失败。' }, { status: 500 });
  }
}
