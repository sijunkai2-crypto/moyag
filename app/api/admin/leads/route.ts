import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

function safeParseJsonLine(line: string) {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

async function readJsonl(filePath: string) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map(safeParseJsonLine)
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function readJsonArray(filePath: string) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const password = request.nextUrl.searchParams.get('password') || '';
  const adminPassword = process.env.ADMIN_PASSWORD || '';

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json(
      { message: '密码错误或后台密码未配置。' },
      { status: 401 }
    );
  }

  const cwd = process.cwd();

  const jsonlPath = path.join(cwd, 'data', 'leads.jsonl');
  const legacyJsonPath = path.join(cwd, 'leads.json');

  const jsonlLeads = await readJsonl(jsonlPath);
  const legacyLeads = await readJsonArray(legacyJsonPath);

  const leads = [...jsonlLeads, ...legacyLeads].sort((a: any, b: any) => {
    const at = new Date(a?.submittedAt || 0).getTime();
    const bt = new Date(b?.submittedAt || 0).getTime();
    return bt - at;
  });

  return NextResponse.json({
    count: leads.length,
    leads,
  });
}
