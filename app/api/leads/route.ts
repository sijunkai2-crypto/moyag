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
  riskLevel?: '高风险' | '中风险' | '低风险';
  issueCount?: number;
  highPriorityCount?: number;
  estimatedFixCycle?: string;
  executiveSummary?: string;
  sections?: Array<{
    title: string;
    summary: string;
    issues: Array<{
      title: string;
      severity: 'high' | 'medium' | 'low';
      evidence: string;
      impact: string;
      recommendation: string;
      expectedBenefit: string;
    }>;
  }>;
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
    h2Count?: number;
    h3Count?: number;
    bodyWordCount?: number;
  };
};

type FollowupPackage = {
  priority: '高' | '中' | '低';
  angle: string;
  nextAction: string;
  offer: string;
  emailSubject: string;
  emailBody: string;
  whatsappMessage: string;
  callScript: string;
};

type Lead = Required<Pick<LeadPayload, 'company' | 'website' | 'product' | 'market' | 'problem' | 'contactName' | 'email'>> & {
  submittedAt: string;
  status: string;
  messenger: string;
  note: string;
  report: SeoReport;
  followup: FollowupPackage;
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

function keywordIncluded(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.some((word) => word && lower.includes(word.toLowerCase()));
}

function pickTopProblems(report: SeoReport) {
  return report.checks
    .filter((check) => check.status !== 'good')
    .slice(0, 3)
    .map((check) => `${check.item}：${check.recommendation}`);
}

function generateFollowupPackage(lead: Omit<Lead, 'followup'>): FollowupPackage {
  const topProblems = pickTopProblems(lead.report);
  const mainProblem = topProblems[0] || '官网 SEO 基础结构仍有继续放大询盘的空间。';
  const priority: FollowupPackage['priority'] = lead.report.status === 'failed' || lead.report.score < 55 ? '高' : lead.report.score < 78 ? '中' : '低';
  const angle = `客户主营 ${lead.product}，目标市场是 ${lead.market}。沟通重点不要只讲“排名”，要讲 Google 搜索流量如何变成可追踪询盘，先用 ${mainProblem} 切入。`;
  const offer = '提供 1 次免费 15 分钟官网 SEO 诊断复盘，交付一份首页问题清单、关键词方向和询盘入口优化建议。';
  const nextAction = priority === '高'
    ? '24 小时内邮件 + WhatsApp/微信同步跟进，优先约诊断电话。'
    : priority === '中'
      ? '48 小时内发送诊断摘要，推动客户确认目标市场和核心产品词。'
      : '发送礼貌型优化建议，建立后续内容 SEO 咨询机会。';
  const subject = `${lead.company} 官网 SEO 初步诊断：发现 ${topProblems.length || 1} 个可提升询盘的问题`;
  const bullets = topProblems.length
    ? topProblems.map((item) => `- ${item}`).join('\n')
    : '- 当前官网已有基础 SEO 信号，但还可以继续强化产品关键词、询盘入口和内容结构。';

  const emailBody = `Hi ${lead.contactName},

我们已经完成了 ${lead.company} 官网的初步 SEO 检测。结合你提交的目标市场「${lead.market}」和主营产品/服务「${lead.product}」，目前最值得优先处理的是：

${bullets}

这些问题会影响 Google 对页面主题的理解，也会影响潜在客户进入官网后的询盘动作。

我们可以先为你做一次 15 分钟免费复盘，把首页 SEO、关键词方向和询盘入口拆开讲清楚。你方便这两天约一个时间吗？

Best regards,
Moyag AI SEO Team`;

  const whatsappMessage = `${lead.contactName} 你好，我们刚看完 ${lead.company} 的官网 SEO 初步检测。主要发现：${topProblems[0] || '官网还有提升 Google 询盘转化的空间'}。可以免费帮你做一次 15 分钟复盘，把 Google 关键词、页面结构和询盘入口讲清楚。你这两天方便吗？`;

  const callScript = `开场：您好，我是 Moyag，刚收到您提交的官网 SEO 检测需求。\n确认：您现在更关注 ${lead.market} 市场的自然流量，还是更关注官网询盘转化？\n切入：我们初步看到的问题是「${mainProblem}」。这类问题通常会让 Google 不容易判断页面主题，也会让客户进站后不知道下一步怎么联系。\n邀约：我建议先用 15 分钟把首页、关键词和询盘入口过一遍，您看今天或明天哪个时间方便？`;

  return {
    priority,
    angle,
    nextAction,
    offer,
    emailSubject: subject,
    emailBody,
    whatsappMessage,
    callScript
  };
}

async function generateSeoReport(website: string, product = '', market = ''): Promise<SeoReport> {
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
    const h2 = getAllTagContent(html, 'h2');
    const h3 = getAllTagContent(html, 'h3');
    const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
    const imageCount = imageTags.length;
    const imagesWithoutAlt = imageTags.filter((img) => !getAttribute(img, 'alt')).length;
    const { internalLinks, externalLinks } = countLinks(html, finalUrl);
    const visibleText = stripHtml(html).toLowerCase();
    const wordCount = stripHtml(html).split(/\s+/).filter(Boolean).length;
    const productWords = product.split(/[,\s/|]+/).map((word) => word.trim().toLowerCase()).filter(Boolean);
    const marketWords = market.split(/[,\s/|]+/).map((word) => word.trim().toLowerCase()).filter(Boolean);
    const hasContactSignal = /contact|quote|inquiry|enquiry|whatsapp|email|request|rfq|咨询|联系/i.test(visibleText);
    const hasFormSignal = /<form\b|type=["']submit["']|request a quote|get quote|contact us|询盘|提交/.test(html.toLowerCase());
    const hasPhoneSignal = /tel:|\+?\d[\d\s\-()]{6,}/.test(html);
    const hasEmailSignal = /mailto:|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(html);
    const b2bSignal = /manufacturer|factory|supplier|oem|odm|export|wholesale|bulk|certification|iso|manufacturing|supply chain|b2b/i.test(visibleText);
    const languageSignal = /lang=["'](en|es|de|fr|ar|ja|ko|ru|pt|it|zh)/i.test(html);

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
      makeCheck(
        '关键词覆盖（产品+市场）',
        keywordIncluded(`${title} ${description} ${visibleText}`, [...productWords, ...marketWords]) ? 'good' : 'bad',
        `产品词命中：${keywordIncluded(visibleText, productWords) ? '是' : '否'}；市场词命中：${keywordIncluded(visibleText, marketWords) ? '是' : '否'}`,
        '在 Title/H1/首屏文案中明确写入产品词与目标市场词，提升相关搜索匹配度。'
      )
    );
    checks.push(
      makeCheck(
        '标题层级结构',
        h2.length >= 2 && h3.length >= 1 ? 'good' : 'warning',
        `检测到 H2 ${h2.length} 个，H3 ${h3.length} 个。`,
        '建议构建“产品优势-应用场景-认证交付-FAQ-询盘入口”的 H2/H3 结构。'
      )
    );
    checks.push(
      makeCheck(
        '正文内容长度',
        wordCount >= 300 ? 'good' : 'warning',
        `页面可见正文约 ${wordCount} 词。`,
        'B2B 首页建议不少于 300-600 词，覆盖能力、场景、认证、交付与CTA。'
      )
    );
    checks.push(
      makeCheck(
        '转化信号完整性',
        hasContactSignal && hasFormSignal && (hasPhoneSignal || hasEmailSignal) ? 'good' : 'warning',
        `联系词：${hasContactSignal ? '有' : '无'}；表单：${hasFormSignal ? '有' : '无'}；电话/邮箱：${hasPhoneSignal || hasEmailSignal ? '有' : '无'}`,
        '确保首屏与页脚同时提供 CTA、表单、WhatsApp/邮箱/电话至少两种联系渠道。'
      )
    );
    checks.push(
      makeCheck(
        '国际市场与B2B信号',
        b2bSignal && (languageSignal || keywordIncluded(visibleText, marketWords)) ? 'good' : 'warning',
        `B2B信号：${b2bSignal ? '有' : '弱'}；多语言/市场词：${languageSignal || keywordIncluded(visibleText, marketWords) ? '有' : '弱'}`,
        '建议补充出口/制造/认证等B2B能力描述，并增加目标市场词与多语言入口。'
      )
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

    const highPriorityCount = checks.filter((check) => check.status === 'bad').length;
    const issueCount = checks.filter((check) => check.status !== 'good').length;
    const riskLevel: SeoReport['riskLevel'] = highPriorityCount >= 3 || score < 55 ? '高风险' : score < 78 ? '中风险' : '低风险';
    const estimatedFixCycle = highPriorityCount >= 3 ? '2-4 周' : issueCount >= 4 ? '1-3 周' : '3-7 天';

    const issuesFromChecks = (status: 'bad' | 'warning', severity: 'high' | 'medium' | 'low') =>
      checks.filter((check) => check.status === status).map((check) => ({
        title: check.item,
        severity,
        evidence: check.finding,
        impact: severity === 'high' ? '可能直接影响收录、排名与询盘转化。' : severity === 'medium' ? '会削弱主题相关性与转化效率。' : '属于可持续优化项。',
        recommendation: check.recommendation,
        expectedBenefit: '提升搜索可见性与高意向询盘质量。'
      }));

    const sections: NonNullable<SeoReport['sections']> = [
      { title: '执行摘要', summary: `综合评分 ${score}/100，风险等级 ${riskLevel}，建议优先处理 ${highPriorityCount} 个高优先级问题。`, issues: [...issuesFromChecks('bad', 'high').slice(0, 2)] },
      { title: '技术 SEO', summary: '覆盖 canonical、robots、viewport、图片alt与链接结构。', issues: [...issuesFromChecks('bad', 'high'), ...issuesFromChecks('warning', 'medium')].slice(0, 4) },
      { title: '页面结构', summary: '聚焦 Title、H1、H2/H3、信息层级。', issues: [...issuesFromChecks('warning', 'medium')].slice(0, 3) },
      { title: '内容与关键词', summary: `结合产品「${product || '未提供'}」和市场「${market || '未提供'}」评估内容覆盖与语义完整性。`, issues: [...issuesFromChecks('bad', 'high'), ...issuesFromChecks('warning', 'medium')].slice(0, 3) },
      { title: '转化线索', summary: '评估 CTA、联系方式、表单与询盘动线。', issues: checks.filter((c) => ['询盘入口', '转化信号完整性'].includes(c.item)).map((c) => ({ title: c.item, severity: (c.status === 'good' ? 'low' : 'medium') as 'low' | 'medium', evidence: c.finding, impact: '影响访客从访问到询盘的转化率。', recommendation: c.recommendation, expectedBenefit: '提升询盘率与线索质量。' })) },
      { title: '竞争与增长机会', summary: `建议围绕 "${product} ${market}"、"${product} supplier"、"${product} manufacturer" 建立内容与落地页。`, issues: [{ title: '增长关键词方向', severity: 'low', evidence: `目标产品：${product || '未填写'}；目标市场：${market || '未填写'}`, impact: '缺少增长关键词布局会限制自然流量上限。', recommendation: '建立产品词×市场词×应用场景词的关键词矩阵，并按商业意图分配落地页。', expectedBenefit: '增加中高意图关键词覆盖，提升可持续获客能力。' }] },
      { title: '优先级行动计划', summary: '按高-中-低优先级安排执行。', issues: [{ title: '30天行动计划', severity: highPriorityCount > 0 ? 'high' : 'medium', evidence: `高优先级问题 ${highPriorityCount} 个，待优化问题 ${issueCount} 个。`, impact: '无计划执行会导致优化分散，难形成可衡量结果。', recommendation: '第1周修复技术阻断项，第2-3周优化标题结构与内容，第4周完善转化入口并复盘数据。', expectedBenefit: '缩短见效时间，提高SEO投入产出比。' }] }
    ];

    return {
      status: 'completed',
      generatedAt,
      summary: `专业诊断完成：得分 ${score}/100，发现 ${issueCount} 个待优化项，${highPriorityCount} 个高优先级问题。`,
      score,
      riskLevel,
      issueCount,
      highPriorityCount,
      estimatedFixCycle,
      executiveSummary: `该站点当前SEO风险为${riskLevel}。建议先修复技术与结构问题，再围绕产品与市场做内容和转化增强。`,
      sections,
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
        hasContactSignal,
        h2Count: h2.length,
        h3Count: h3.length,
        bodyWordCount: wordCount
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
      <p style="margin:0 0 18px;color:#596579;">客户刚刚提交了官网 SEO 检测需求。系统已生成初步诊断草稿和销售跟进建议，请人工复核后跟进。</p>
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

      <h3 style="margin:22px 0 8px;">销售跟进包</h3>
      <p><b>优先级：</b>${escapeHtml(lead.followup.priority)}</p>
      <p><b>切入角度：</b>${escapeHtml(lead.followup.angle)}</p>
      <p><b>下一步：</b>${escapeHtml(lead.followup.nextAction)}</p>
      <p><b>邀约：</b>${escapeHtml(lead.followup.offer)}</p>
      <p><b>邮件标题：</b>${escapeHtml(lead.followup.emailSubject)}</p>
      <pre style="white-space:pre-wrap;background:#f7f9fc;border:1px solid #e6e9ef;border-radius:12px;padding:14px;">${escapeHtml(lead.followup.emailBody)}</pre>
      <p><b>WhatsApp/微信：</b>${escapeHtml(lead.followup.whatsappMessage)}</p>
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
    ]),
    '',
    '销售跟进包',
    `优先级：${lead.followup.priority}`,
    `切入角度：${lead.followup.angle}`,
    `下一步：${lead.followup.nextAction}`,
    `邀约：${lead.followup.offer}`,
    `邮件标题：${lead.followup.emailSubject}`,
    lead.followup.emailBody,
    `WhatsApp/微信：${lead.followup.whatsappMessage}`,
    `电话脚本：${lead.followup.callScript}`
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
    subject: `新 SEO 检测线索：${lead.company}｜初步得分 ${lead.report.score}/100｜跟进优先级 ${lead.followup.priority}`,
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

    const report = await generateSeoReport(String(body.website).trim(), String(body.product).trim(), String(body.market).trim());

    const baseLead: Omit<Lead, 'followup'> = {
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

    const lead: Lead = {
      ...baseLead,
      followup: generateFollowupPackage(baseLead)
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
