'use client';

import { FormEvent, useMemo, useState } from 'react';

type SeoReport = {
  status?: 'completed' | 'failed' | string;
  generatedAt?: string;
  summary?: string;
  score?: number;
  checks?: Array<{
    item?: string;
    status?: 'good' | 'warning' | 'bad' | string;
    finding?: string;
    recommendation?: string;
  }>;
  page?: {
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

type FollowupPackage = {
  priority?: string;
  angle?: string;
  nextAction?: string;
  offer?: string;
  emailSubject?: string;
  emailBody?: string;
  whatsappMessage?: string;
  callScript?: string;
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
  report?: SeoReport;
  followup?: FollowupPackage;
};

const statusLabel: Record<string, string> = {
  good: '良好',
  warning: '可优化',
  bad: '高优先级'
};

function text(value: unknown, fallback = '未填写') {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '是' : '否';
  return fallback;
}

function safeDate(value: unknown) {
  if (typeof value !== 'string' || !value) return '未知时间';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN');
}

function safeUrl(value: unknown) {
  const url = text(value, '');
  return url || '#';
}

function copyText(value: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(value).catch(() => undefined);
  }
}

function reportLevel(score: unknown) {
  const value = Number(score || 0);
  if (value >= 80) return '基础较好';
  if (value >= 60) return '有增长空间';
  if (value > 0) return '优先修复';
  return '需人工复核';
}

export default function AdminLeads() {
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  async function loadLeads(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/leads', {
        headers: { 'x-admin-password': password }
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || '读取失败。');

      setLeads(Array.isArray(data.leads) ? data.leads : []);
      setIsAuthed(true);
      setMessage(`已读取 ${Array.isArray(data.leads) ? data.leads.length : 0} 条线索。`);
    } catch (error) {
      setIsAuthed(false);
      setLeads([]);
      setMessage(error instanceof Error ? error.message : '读取失败。');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredLeads = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return leads;

    return leads.filter((lead) => {
      return [
        lead.company,
        lead.website,
        lead.product,
        lead.market,
        lead.problem,
        lead.contactName,
        lead.email,
        lead.messenger,
        lead.note,
        lead.report?.summary,
        lead.report?.page?.title,
        lead.report?.page?.description,
        lead.report?.page?.canonical,
        lead.followup?.priority,
        lead.followup?.angle,
        lead.followup?.nextAction,
        lead.followup?.emailSubject,
        lead.followup?.emailBody,
        lead.followup?.whatsappMessage
      ].some((value) => text(value, '').toLowerCase().includes(keyword));
    });
  }, [leads, query]);

  return (
    <main className="adminPage">
      <section className="adminHeader">
        <div>
          <p className="eyebrow">Moyag Admin</p>
          <h1>SEO 检测线索后台</h1>
          <p>查看客户提交的官网 SEO 检测需求。新线索会自动附带诊断报告、页面数据和销售跟进包。</p>
        </div>
        <a className="secondaryBtn" href="/">返回官网</a>
      </section>

      <section className="adminPanel">
        <form className="adminLogin" onSubmit={loadLeads}>
          <label>
            后台密码
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="输入 ADMIN_PASSWORD"
              required
            />
          </label>
          <button className="submitBtn" type="submit" disabled={isLoading}>
            {isLoading ? '读取中...' : '读取线索'}
          </button>
          {message && <p className="adminMessage">{message}</p>}
        </form>

        {isAuthed && (
          <div className="adminTools">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索公司、官网、产品、市场、联系人、诊断摘要、页面标题、跟进话术..."
            />
            <button className="secondaryBtn" onClick={() => loadLeads()} disabled={isLoading}>刷新</button>
          </div>
        )}

        {isAuthed && (
          <div className="leadList">
            {filteredLeads.length === 0 ? (
              <div className="emptyState">暂无匹配线索。</div>
            ) : (
              filteredLeads.map((lead, index) => {
                const report = lead.report;
                const page = report?.page;
                const checks = Array.isArray(report?.checks) ? report.checks : [];
                const followup = lead.followup;
                const website = safeUrl(lead.website);
                const email = text(lead.email, '');
                const score = Number(report?.score || 0);

                return (
                  <article className="leadCard" key={`${text(lead.submittedAt, 'time')}-${email}-${index}`}>
                    <div className="leadTop">
                      <div>
                        <p className="leadTime">{safeDate(lead.submittedAt)}</p>
                        <h2>{text(lead.company, '未填写公司名称')}</h2>
                      </div>
                      <span>{followup?.priority ? `跟进 ${followup.priority}` : report ? `SEO ${text(report.score, '0')}/100` : text(lead.status, '新提交')}</span>
                    </div>
                    <div className="leadGrid">
                      <div><b>官网</b>{website === '#' ? <p>未填写</p> : <a href={website} target="_blank" rel="noreferrer">{website}</a>}</div>
                      <div><b>产品/服务</b><p>{text(lead.product)}</p></div>
                      <div><b>目标市场</b><p>{text(lead.market)}</p></div>
                      <div><b>当前问题</b><p>{text(lead.problem)}</p></div>
                      <div><b>联系人</b><p>{text(lead.contactName)}</p></div>
                      <div><b>邮箱</b>{email ? <a href={`mailto:${email}`}>{email}</a> : <p>未填写</p>}</div>
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

                        <div className="reportMetrics">
                          <div><b>报告评级</b><p>{reportLevel(score)}</p></div>
                          <div><b>生成时间</b><p>{safeDate(report.generatedAt)}</p></div>
                          <div><b>最终抓取 URL</b><p>{text(page?.finalUrl)}</p></div>
                          <div><b>Title 长度</b><p>{text(page?.titleLength)} 字符</p></div>
                          <div><b>Description 长度</b><p>{text(page?.descriptionLength)} 字符</p></div>
                          <div><b>H1 数量</b><p>{text(page?.h1Count)}</p></div>
                          <div><b>图片 / 缺 Alt</b><p>{text(page?.imageCount, '0')} / {text(page?.imagesWithoutAlt, '0')}</p></div>
                          <div><b>内链 / 外链</b><p>{text(page?.internalLinks, '0')} / {text(page?.externalLinks, '0')}</p></div>
                          <div><b>询盘信号</b><p>{text(page?.hasContactSignal)}</p></div>
                        </div>

                        <div className="pageSnapshot">
                          <div><b>页面 Title</b><p>{text(page?.title)}</p></div>
                          <div><b>Meta Description</b><p>{text(page?.description)}</p></div>
                          <div><b>H1 列表</b><p>{Array.isArray(page?.h1) && page.h1.length ? page.h1.join(' / ') : '未检测到'}</p></div>
                          <div><b>Canonical</b><p>{text(page?.canonical)}</p></div>
                          <div><b>Robots</b><p>{text(page?.robots, '未检测到 noindex')}</p></div>
                        </div>

                        <div className="reportChecks">
                          {checks.length === 0 ? (
                            <div className="emptyState">暂无诊断检查项。</div>
                          ) : (
                            checks.map((check, checkIndex) => {
                              const checkStatus = text(check.status, 'warning');
                              return (
                                <div className={`reportCheck ${checkStatus}`} key={`${text(check.item, 'item')}-${checkIndex}`}>
                                  <div className="reportCheckTop">
                                    <b>{text(check.item, '未命名检查项')}</b>
                                    <span>{statusLabel[checkStatus] || checkStatus}</span>
                                  </div>
                                  <p><strong>发现：</strong>{text(check.finding)}</p>
                                  <p><strong>建议：</strong>{text(check.recommendation)}</p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </section>
                    )}

                    {followup && (
                      <section className="followupBox">
                        <div className="followupHead">
                          <div>
                            <b>销售跟进包</b>
                            <p>系统按客户产品、市场和 SEO 问题生成，可直接复制后人工微调。</p>
                          </div>
                          <span>优先级：{text(followup.priority, '中')}</span>
                        </div>
                        <div className="followupGrid">
                          <div><b>切入角度</b><p>{text(followup.angle)}</p></div>
                          <div><b>下一步动作</b><p>{text(followup.nextAction)}</p></div>
                          <div><b>邀约方案</b><p>{text(followup.offer)}</p></div>
                          <div><b>邮件标题</b><p>{text(followup.emailSubject)}</p></div>
                        </div>
                        <div className="copyBlock">
                          <div className="copyBlockTop"><b>邮件正文</b><button onClick={() => copyText(text(followup.emailBody, ''))}>复制</button></div>
                          <pre>{text(followup.emailBody)}</pre>
                        </div>
                        <div className="copyBlock">
                          <div className="copyBlockTop"><b>WhatsApp / 微信话术</b><button onClick={() => copyText(text(followup.whatsappMessage, ''))}>复制</button></div>
                          <pre>{text(followup.whatsappMessage)}</pre>
                        </div>
                        <div className="copyBlock">
                          <div className="copyBlockTop"><b>电话开场脚本</b><button onClick={() => copyText(text(followup.callScript, ''))}>复制</button></div>
                          <pre>{text(followup.callScript)}</pre>
                        </div>
                      </section>
                    )}
                  </article>
                );
              })
            )}
          </div>
        )}
      </section>
    </main>
  );
}
