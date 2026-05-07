import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

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

type Lead = Required<Pick<LeadPayload, 'company' | 'website' | 'product' | 'market' | 'problem' | 'contactName' | 'email'>> & {
  submittedAt: string;
  status: string;
  messenger: string;
  note: string;
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getEmailConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.LEAD_NOTIFY_TO || user;
  const from = process.env.LEAD_NOTIFY_FROM || user;

  if (!host || !user || !pass || !to || !from) return null;

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    to,
    from
  };
}

function buildLeadEmailHtml(lead: Lead) {
  const rows = [
    ['提交时间', lead.submittedAt],
    ['公司名称', lead.company],
    ['官网链接', lead.website],
    ['主营产品 / 服务', lead.product],
    ['目标市场', lead.market],
    ['当前问题', lead.problem],
    ['联系人', lead.contactName],
    ['邮箱', lead.email],
    ['WhatsApp / 微信', lead.messenger || '未填写'],
    ['补充说明', lead.note || '未填写']
  ];

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.7;color:#172033;max-width:720px;">
      <h2 style="margin:0 0 16px;">Moyag SEO 检测新线索</h2>
      <p style="margin:0 0 18px;color:#596579;">客户刚刚提交了官网 SEO 检测需求。请尽快跟进。</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e6e9ef;">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="width:170px;padding:10px 12px;border:1px solid #e6e9ef;background:#f7f9fc;font-weight:bold;">${escapeHtml(label)}</td>
            <td style="padding:10px 12px;border:1px solid #e6e9ef;">${escapeHtml(value)}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;
}

function buildLeadEmailText(lead: Lead) {
  return [
    'Moyag SEO 检测新线索',
    '',
    `提交时间：${lead.submittedAt}`,
    `公司名称：${lead.company}`,
    `官网链接：${lead.website}`,
    `主营产品 / 服务：${lead.product}`,
    `目标市场：${lead.market}`,
    `当前问题：${lead.problem}`,
    `联系人：${lead.contactName}`,
    `邮箱：${lead.email}`,
    `WhatsApp / 微信：${lead.messenger || '未填写'}`,
    `补充说明：${lead.note || '未填写'}`
  ].join('\n');
}

async function sendLeadNotification(lead: Lead) {
  const config = getEmailConfig();

  if (!config) {
    console.warn('SMTP email notification is not configured. Lead was saved locally only.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth
  });

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: lead.email,
    subject: `新 SEO 检测线索：${lead.company}`,
    text: buildLeadEmailText(lead),
    html: buildLeadEmailHtml(lead)
  });
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

    const lead: Lead = {
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

    try {
      await sendLeadNotification(lead);
    } catch (emailError) {
      console.error('Failed to send lead notification email:', emailError);
    }

    return NextResponse.json({ ok: true, message: '提交成功。' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '服务器处理失败，请稍后再试。' }, { status: 500 });
  }
}
