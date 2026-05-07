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

type SeoReport = {
  status: 'completed' | 'failed';
  generatedAt: string;
  summary: string;
  score: number;
  checks: Array<{
    item: string;
    status: 'good' | 'warning' | 'bad';
    finding: string;
    recommendation: string;
  }>;
  page: {
    finalUrl?: string;
    title?: string;
    titleLength?: number;
    description?: string;
    descriptionLength?: number;
    h1?: string[];
    h1Count?: number;
    canonical?: string;
    robots?: string;
    viewport?: string;
    imageCount?: number;
    imagesWithoutAlt?: number;
    internalLinks?: number;
    externalLinks?: number;
    hasContactSignal?: boolean;
  };
};

type Lead = Required<Pick<LeadPayload, 'company' | 'website' | 'product' | 'market' | 'problem' | 'contactName' | 'email'>> & {
  submittedAt: string;
  status: string;
  messenger: string;
  note: string;
  report: SeoReport;
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

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeBasicEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function getTagContent(html: string, tag: string) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeBasicEntities(stripHtml(match[1])) : '';
}

function getAllTagContent(html: string, tag: string) {
  const matches = [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))];
  return matches.map((match) => decodeBasicEntities(stripHtml(match[1]))).filter(Boolean);
}

function getAttribute(tagHtml: string, attribute: string) {
  const match = tagHtml.match(new RegExp(`${attribute}=["']([^"']*)["']`, 'i'));
  return match ? decodeBasicEntities(match[1]) : '';
}

function getMetaContent(html: string, key: string) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const target = key.toLowerCase();

  for (const meta of metas) {
    const name = getAttribute(meta, 'name').toLowerCase();
    const property = getAttribute(meta, 'property').toLowerCase();
    if (name === target || property === target) return getAttribute(meta, 'content');
  }

  return '';
}

function getLinkHref(html: string, relValue: string) {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  const target = relValue.toLowerCase();

  for (const link of links) {
    const rel = getAttribute(link, 'rel').toLowerCase();
    if (rel === target) return getAttribute(link, 'href');
  }

  return '';
}

function countLinks(html: string, baseUrl: string) {
  const base = new URL(baseUrl);
  const anchors = [...html.matchAll(/<a\b[^>]*>/gi)].map((match) => match[0]);
  let internalLinks = 0;
  let externalLinks = 0;

  for (const anchor of anchors) {
    const href = getAttribute(anchor, 'href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;

    try {
      const url = new URL(href, base);
      if (url.hostname === base.hostname) internalLinks += 1;
      else externalLinks += 1;
    } catch {
      // Ignore malformed links.
    }
  }

  return { internalLinks, externalLinks };
}

function makeCheck(item: string, status: 'good' | 'warning' | 'bad', finding: string, recommendation: string) {
  return { item, status, finding, recommendation };
}

async function generateSeoReport(website: string): Promise<SeoReport> {
  const generatedAt = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const response = await fetch(website, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 Moyag SEO Audit Bot/0.1'
      }
    });
    clearTimeout(timeout);

    const html = await response.text();
    const finalUrl = response.url || website;
    const title = getTagContent(html, 'title');
    const description = getMetaContent(html, 'description');
    const h1 = getAllTagContent(html, 'h1');
    const canonical = getLinkHref(html, 'canonical');
    const robots = getMetaContent(html, 'robots');
    const viewport = getMetaContent(html, 'viewport');
    const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
    const imageCount = imageTags.length;
    const imagesWithoutAlt = imageTags.filter((img) => !getAttribute(img, 'alt')).length;
    const { internalLinks, externalLinks } = countLinks(html, finalUrl);
    const visibleText = stripHtml(html).toLowerCase();
    const hasContactSignal = /contact|quote|inquiry|enquiry|whatsapp|email|request|rfq|咨询|联系/i.test(visibleText);

    const checks: SeoReport['checks'] = [];

    checks.push(
      title
        ? makeCheck(
            'Title 标题',
            title.length >= 30 && title.length <= 65 ? 'good' : 'warning',
            `检测到标题：${title}（${title.length} 字符）`,
            title.length >= 30 && title.length <= 65
              ? '标题长度基本合适，后续需要加入核心产品词和目标市场词。'
              : '建议将 Title 控制在 30-65 字符，并前置核心产品关键词。'
          )
        : makeCheck('Title 标题', 'bad', '未检测到页面 Title。', '需要为首页添加清晰的英文 Title，包含产品、用途和品牌。')
    );

    checks.push(
      description
        ? makeCheck(
            'Meta Description',
            description.length >= 70 && description.length <= 160 ? 'good' : 'warning',
            `检测到描述：${description}（${description.length} 字符）`,
            description.length >= 70 && description.length <= 160
              ? '描述长度基本合适，建议继续强化询盘理由和差异化卖点。'
              : '建议将描述控制在 70-160 字符，并写清产品、应用、认证、交付能力。'
          )
        : makeCheck('Meta Description', 'bad', '未检测到 Meta Description。', '需要补充首页描述，用于提升 Google 搜索摘要点击率。')
    );

    checks.push(
      h1.length === 1
        ? makeCheck('H1 主标题', 'good', `检测到 1 个 H1：${h1[0]}`, 'H1 数量合理，后续可检查是否包含核心产品词。')
        : h1.length === 0
          ? makeCheck('H1 主标题', 'bad', '未检测到 H1。', '首页需要 1 个清晰 H1，说明主营产品和目标客户。')
          : makeCheck('H1 主标题', 'warning', `检测到 ${h1.length} 个 H1。`, '建议首页只保留 1 个 H1，其余主标题改为 H2/H3。')
    );

    checks.push(
      viewport
        ? makeCheck('移动端适配', 'good', '检测到 viewport 标签。', '移动端基础适配存在，后续需用真机检查首屏转化。')
        : makeCheck('移动端适配', 'warning', '未检测到 viewport 标签。', '建议添加 viewport，避免移动端展示异常。')
    );

    checks.push(
      canonical
        ? makeCheck('Canonical', 'good', `检测到 canonical：${canonical}`, '规范链接存在，可减少重复页面风险。')
        : makeCheck('Canonical', 'warning', '未检测到 canonical。', '建议为核心页面添加 canonical，尤其是多语言或多参数页面。')
    );

    checks.push(
      imageCount > 0
        ? makeCheck(
            '图片 Alt',
            imagesWithoutAlt === 0 ? 'good' : 'warning',
            `检测到 ${imageCount} 张图片，其中 ${imagesWithoutAlt} 张缺少 alt。`,
            imagesWithoutAlt === 0
              ? '图片 alt 基础良好，后续可加入产品词和应用场景词。'
              : '建议为产品图、工厂图、案例图添加英文 alt，帮助图片 SEO 和页面语义。'
          )
        : makeCheck('图片 Alt', 'warning', '首页未检测到图片。', 'B2B 官网建议补充产品、工厂、应用场景图片，并配置 alt。')
    );

    checks.push(
      internalLinks >= 5
        ? makeCheck('内链结构', 'good', `检测到约 ${internalLinks} 个内部链接。`, '内链基础可用，后续可增加产品分类、案例、博客之间的语义链接。')
        : makeCheck('内链结构', 'warning', `检测到约 ${internalLinks} 个内部链接。`, '建议增加产品分类页、应用页、案例页、联系我们页之间的内链。')
    );

    checks.push(
      hasContactSignal
        ? makeCheck('询盘入口', 'good', '首页检测到联系、询盘或报价相关信号。', '后续可优化按钮位置和表单字段，降低客户提交阻力。')
        : makeCheck('询盘入口', 'warning', '首页未明显检测到联系/询盘/报价信号。', '建议在首屏和产品区增加 Request a Quote / Contact Us / WhatsApp 入口。')
    );

    if (robots && /noindex/i.test(robots)) {
      checks.push(makeCheck('Robots 索引', 'bad', `检测到 robots：${robots}`, '页面可能禁止 Google 收录，需要立即检查。'));
    } else {
      checks.push(makeCheck('Robots 索引', 'good', robots ? `检测到 robots：${robots}` : '未检测到 noindex。', '暂未发现明显禁止收录信号。'));
    }

    const score = Math.max(0, Math.min(100, Math.round(checks.reduce((sum, check) => {
      if (check.status === 'good') return sum + 11;
      if (check.status === 'warning') return sum + 6;
      return sum + 1;
    }, 0))));

    const warningCount = checks.filter((check) => check.status === 'warning').length;
    const badCount = checks.filter((check) => check.status === 'bad').length;

    return {
      status: 'completed',
      generatedAt,
      summary: `初步检测完成：得分 ${score}/100，发现 ${warningCount} 个可优化项，${badCount} 个高优先级问题。`,
      score,
      checks,
      page: {
        finalUrl,
        title,
        titleLength: title.length,
        description,
        descriptionLength: description.length,
        h1,
        h1Count: h1.length,
        canonical,
        robots,
        viewport,
        imageCount,
        imagesWithoutAlt,
        internalLinks,
        externalLinks,
        hasContactSignal
      }
    };
  } catch (error) {
    console.error('Failed to generate SEO report:', error);
    return {
      status: 'failed',
      generatedAt,
      summary: '系统未能自动抓取该官网首页，可能是目标网站阻止访问、响应超时或 SSL 配置异常。线索已正常保存，建议人工打开官网检查。',
      score: 0,
      checks: [
        makeCheck('官网抓取', 'bad', '自动抓取失败。', '人工确认官网是否可访问，并检查是否屏蔽海外服务器或爬虫访问。')
      ],
      page: {}
    };
  }
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

  const reportRows = lead.report.checks.map((check) => `
    <tr>
      <td style="padding:10px 12px;border:1px solid #e6e9ef;font-weight:bold;">${escapeHtml(check.item)}</td>
      <td style="padding:10px 12px;border:1px solid #e6e9ef;">${escapeHtml(check.status)}</td>
      <td style="padding:10px 12px;border:1px solid #e6e9ef;">${escapeHtml(check.finding)}</td>
      <td style="padding:10px 12px;border:1px solid #e6e9ef;">${escapeHtml(check.recommendation)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.7;color:#172033;max-width:860px;">
      <h2 style="margin:0 0 16px;">Moyag SEO 检测新线索</h2>
      <p style="margin:0 0 18px;color:#596579;">客户刚刚提交了官网 SEO 检测需求。系统已生成初步诊断草稿，请人工复核后跟进。</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e6e9ef;margin-bottom:22px;">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="width:170px;padding:10px 12px;border:1px solid #e6e9ef;background:#f7f9fc;font-weight:bold;">${escapeHtml(label)}</td>
            <td style="padding:10px 12px;border:1px solid #e6e9ef;">${escapeHtml(value)}</td>
          </tr>
        `).join('')}
      </table>

      <h3 style="margin:22px 0 8px;">SEO 初步诊断草稿</h3>
      <p style="margin:0 0 12px;color:#596579;">${escapeHtml(lead.report.summary)}</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e6e9ef;">
        <tr style="background:#f7f9fc;">
          <th style="padding:10px 12px;border:1px solid #e6e9ef;text-align:left;">检查项</th>
          <th style="padding:10px 12px;border:1px solid #e6e9ef;text-align:left;">状态</th>
          <th style="padding:10px 12px;border:1px solid #e6e9ef;text-align:left;">发现</th>
          <th style="padding:10px 12px;border:1px solid #e6e9ef;text-align:left;">建议</th>
        </tr>
        ${reportRows}
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
    `补充说明：${lead.note || '未填写'}`,
    '',
    'SEO 初步诊断草稿',
    lead.report.summary,
    ...lead.report.checks.flatMap((check) => [
      '',
      `检查项：${check.item}`,
      `状态：${check.status}`,
      `发现：${check.finding}`,
      `建议：${check.recommendation}`
    ])
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
    subject: `新 SEO 检测线索：${lead.company}｜初步得分 ${lead.report.score}/100`,
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

    const report = await generateSeoReport(String(body.website).trim());

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
      note: body.note ? String(body.note).trim() : '',
      report
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
