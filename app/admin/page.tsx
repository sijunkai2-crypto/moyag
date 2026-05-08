import { promises as fs } from 'fs';
import path from 'path';

export const metadata = {
  title: 'Moyag Leads Admin'
};

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

type AdminPageProps = {
  searchParams?: SearchParams;
};

type Lead = {
  submittedAt?: string;
  status?: string;
  company?: string;
  website?: string;
  product?: string;
  market?: string;
  problem?: string;
  contactName?: string;
  email?: string;
  messenger?: string;
  note?: string;
  report?: {
    status?: string;
    generatedAt?: string;
    summary?: string;
    score?: number;
    riskLevel?: string;
    issueCount?: number;
    highPriorityCount?: number;
    estimatedFixCycle?: string;
    executiveSummary?: string;
    sections?: Array<{
      title?: string;
      summary?: string;
      issues?: Array<{
        title?: string;
        severity?: string;
        evidence?: string;
        impact?: string;
        recommendation?: string;
        expectedBenefit?: string;
      }>;
    }>;
    checks?: Array<{
      item?: string;
      status?: string;
      finding?: string;
      recommendation?: string;
    }>;
    page?: Record<string, unknown>;
  };
  followup?: {
    priority?: string;
    angle?: string;
    nextAction?: string;
    offer?: string;
    emailSubject?: string;
    emailBody?: string;
    whatsappMessage?: string;
    callScript?: string;
  };
};

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function text(value: unknown, fallback = '未填写') {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '是' : '否';
  return fallback;
}

function parseDate(value: unknown) {
  if (typeof value !== 'string' || !value) return '未知时间';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', { hour12: false });
}

function parseLeadLine(line: string): Lead | null {
  try {
    return JSON.parse(line) as Lead;
  } catch {
    return null;
  }
}

async function readLeads() {
  const filePath = path.join(process.cwd(), 'data', 'leads.jsonl');
  const content = await fs.readFile(filePath, 'utf8').catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return '';
    throw error;
  });

  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseLeadLine)
    .filter((lead): lead is Lead => Boolean(lead))
    .reverse();
}

function renderPageValue(value: unknown) {
  if (Array.isArray(value)) return value.length ? value.join(' / ') : '未检测到';
  return text(value, '未检测到');
}

function severityLabel(severity: string) {
  if (severity === 'high') return '高';
  if (severity === 'medium') return '中';
  return '低';
}

function AdminLogin({ message }: { message?: string }) {
  return (
    <form className="adminLogin" method="get">
      <label>
        后台密码
        <input name="password" type="password" placeholder="输入 ADMIN_PASSWORD" required />
      </label>
      <button className="submitBtn" type="submit">读取线索</button>
      {message && <p className="adminMessage">{message}</p>}
    </form>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const password = pick(searchParams?.password);
  const configuredPassword = process.env.ADMIN_PASSWORD || '';
  const isPasswordSubmitted = Boolean(password);
  const isAuthed = Boolean(configuredPassword && password === configuredPassword);
  const leads = isAuthed ? await readLeads() : [];

  return (
    <main className="adminPage">
      <section className="adminHeader">
        <div>
          <p className="eyebrow">Moyag Admin</p>
          <h1>SEO 检测线索后台</h1>
          <p>查看客户提交的官网 SEO 检测需求。这个版本为服务器直接渲染，不依赖浏览器端脚本。</p>
        </div>
        <a className="secondaryBtn" href="/">返回官网</a>
      </section>

      <section className="adminPanel">
        {!isAuthed && (
          <AdminLogin message={isPasswordSubmitted ? '密码错误或 ADMIN_PASSWORD 未配置。' : undefined} />
        )}

        {isAuthed && (
          <>
            <div className="adminTools">
              <p>已读取 {leads.length} 条线索。</p>
              <a className="secondaryBtn" href="/admin">退出</a>
            </div>

            <div className="leadList">
              {leads.length === 0 ? (
                <div className="emptyState">暂无线索。</div>
              ) : (
                leads.map((lead, index) => {
                  const report = lead.report;
                  const page = report?.page || {};
                  const checks = Array.isArray(report?.checks) ? report.checks : [];
                  const followup = lead.followup;
                  const website = text(lead.website, '');

                  return (
                    <article className="leadCard" key={`${text(lead.submittedAt, 'time')}-${index}`}>
                      <div className="leadTop">
                        <div>
                          <p className="leadTime">{parseDate(lead.submittedAt)}</p>
                          <h2>{text(lead.company, '未填写公司名称')}</h2>
                        </div>
                        <span>{report ? `SEO ${text(report.score, '0')}/100` : text(lead.status, '新提交')}</span>
                      </div>

                      <div className="leadGrid">
                        <div><b>官网</b>{website ? <a href={website} target="_blank" rel="noreferrer">{website}</a> : <p>未填写</p>}</div>
                        <div><b>产品/服务</b><p>{text(lead.product)}</p></div>
                        <div><b>目标市场</b><p>{text(lead.market)}</p></div>
                        <div><b>当前问题</b><p>{text(lead.problem)}</p></div>
                        <div><b>联系人</b><p>{text(lead.contactName)}</p></div>
                        <div><b>邮箱</b>{text(lead.email, '') ? <a href={`mailto:${text(lead.email, '')}`}>{text(lead.email, '')}</a> : <p>未填写</p>}</div>
                        <div><b>WhatsApp / 微信</b><p>{text(lead.messenger)}</p></div>
                        <div><b>补充说明</b><p>{text(lead.note)}</p></div>
                      </div>

                      {report && (
                        <section className="reportBox">
                          <div className="reportHead">
                            <div>
                              <b>SEO 诊断报告</b>
                              <p>{text(report.summary, '该线索暂无诊断摘要。')}</p>
                            </div>
                            <strong>{text(report.score, '0')}/100</strong>
                          </div>

                          <div className="kpiGrid">
                            <div className="kpiCard"><b>综合评分</b><p>{text(report.score, '0')}/100</p></div>
                            <div className="kpiCard"><b>风险等级</b><p>{text(report.riskLevel, '未分级')}</p></div>
                            <div className="kpiCard"><b>问题数量</b><p>{text(report.issueCount, String(checks.filter((c) => c.status !== 'good').length))}</p></div>
                            <div className="kpiCard"><b>高优先级问题</b><p>{text(report.highPriorityCount, String(checks.filter((c) => c.status === 'bad').length))}</p></div>
                            <div className="kpiCard"><b>预计修复周期</b><p>{text(report.estimatedFixCycle, '待评估')}</p></div>
                          </div>

                          <div className="reportMetrics">
                            <div><b>生成时间</b><p>{parseDate(report.generatedAt)}</p></div>
                            <div><b>最终抓取 URL</b><p>{renderPageValue(page.finalUrl)}</p></div>
                            <div><b>页面 Title</b><p>{renderPageValue(page.title)}</p></div>
                            <div><b>Title 长度</b><p>{renderPageValue(page.titleLength)} 字符</p></div>
                            <div><b>Description 长度</b><p>{renderPageValue(page.descriptionLength)} 字符</p></div>
                            <div><b>H1 数量</b><p>{renderPageValue(page.h1Count)}</p></div>
                            <div><b>H2 / H3 数量</b><p>{renderPageValue(page.h2Count)} / {renderPageValue(page.h3Count)}</p></div>
                            <div><b>图片 / 缺 Alt</b><p>{renderPageValue(page.imageCount)} / {renderPageValue(page.imagesWithoutAlt)}</p></div>
                            <div><b>内链 / 外链</b><p>{renderPageValue(page.internalLinks)} / {renderPageValue(page.externalLinks)}</p></div>
                            <div><b>询盘信号</b><p>{renderPageValue(page.hasContactSignal)}</p></div>
                            <div><b>正文词数</b><p>{renderPageValue(page.bodyWordCount)}</p></div>
                          </div>

                          <div className="pageSnapshot">
                            <div><b>Meta Description</b><p>{renderPageValue(page.description)}</p></div>
                            <div><b>H1 列表</b><p>{renderPageValue(page.h1)}</p></div>
                            <div><b>Canonical</b><p>{renderPageValue(page.canonical)}</p></div>
                            <div><b>Robots</b><p>{renderPageValue(page.robots)}</p></div>
                          </div>

                          <div className="proSectionGrid">
                            {(Array.isArray(report.sections) && report.sections.length
                              ? report.sections
                              : [
                                  { title: '执行摘要', summary: report.executiveSummary || report.summary, issues: [] },
                                  { title: '技术 SEO', summary: '兼容旧版报告，暂无分区数据。', issues: [] },
                                  { title: '页面结构', summary: '兼容旧版报告，暂无分区数据。', issues: [] },
                                  { title: '内容与关键词', summary: '兼容旧版报告，暂无分区数据。', issues: [] },
                                  { title: '转化线索', summary: '兼容旧版报告，暂无分区数据。', issues: [] },
                                  { title: '竞争与增长机会', summary: '兼容旧版报告，暂无分区数据。', issues: [] },
                                  { title: '优先级行动计划', summary: '兼容旧版报告，暂无分区数据。', issues: [] }
                                ]
                            ).map((section, sectionIndex) => (
                              <div className="proSectionCard" key={`${text(section.title, 'section')}-${sectionIndex}`}>
                                <h3>{text(section.title, '未命名分区')}</h3>
                                <p>{text(section.summary, '暂无摘要')}</p>
                                <div className="issueList">
                                  {(Array.isArray(section.issues) ? section.issues : []).map((issue, issueIndex) => (
                                    <div className={`issueCard severity-${text(issue.severity, 'low')}`} key={`${text(issue.title, 'issue')}-${issueIndex}`}>
                                      <div className="issueTop"><b>{text(issue.title, '未命名问题')}</b><span>{severityLabel(text(issue.severity, 'low'))}</span></div>
                                      <p><strong>发现依据：</strong>{text(issue.evidence, '暂无')}</p>
                                      <p><strong>影响说明：</strong>{text(issue.impact, '暂无')}</p>
                                      <p><strong>修复建议：</strong>{text(issue.recommendation, '暂无')}</p>
                                      <p><strong>预期收益：</strong>{text(issue.expectedBenefit, '暂无')}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="reportChecks">
                            {checks.map((check, checkIndex) => (
                              <div className={`reportCheck ${text(check.status, 'warning')}`} key={`${text(check.item, 'item')}-${checkIndex}`}>
                                <div className="reportCheckTop">
                                  <b>{text(check.item, '未命名检查项')}</b>
                                  <span>{text(check.status, 'warning')}</span>
                                </div>
                                <p><strong>发现：</strong>{text(check.finding)}</p>
                                <p><strong>建议：</strong>{text(check.recommendation)}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {followup && (
                        <section className="followupBox">
                          <div className="followupHead">
                            <div>
                              <b>销售跟进包</b>
                              <p>{text(followup.angle)}</p>
                            </div>
                            <span>优先级：{text(followup.priority, '中')}</span>
                          </div>
                          <div className="followupGrid">
                            <div><b>下一步动作</b><p>{text(followup.nextAction)}</p></div>
                            <div><b>邀约方案</b><p>{text(followup.offer)}</p></div>
                            <div><b>邮件标题</b><p>{text(followup.emailSubject)}</p></div>
                          </div>
                          <div className="copyBlock"><b>邮件正文</b><pre>{text(followup.emailBody)}</pre></div>
                          <div className="copyBlock"><b>WhatsApp / 微信话术</b><pre>{text(followup.whatsappMessage)}</pre></div>
                          <div className="copyBlock"><b>电话开场脚本</b><pre>{text(followup.callScript)}</pre></div>
                        </section>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
