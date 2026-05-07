'use client';

import { FormEvent, useMemo, useState } from 'react';

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

      setLeads(data.leads || []);
      setIsAuthed(true);
      setMessage(`已读取 ${data.leads?.length || 0} 条线索。`);
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
        lead.note
      ].some((value) => value.toLowerCase().includes(keyword));
    });
  }, [leads, query]);

  return (
    <main className="adminPage">
      <section className="adminHeader">
        <div>
          <p className="eyebrow">Moyag Admin</p>
          <h1>SEO 检测线索后台</h1>
          <p>查看客户提交的官网 SEO 检测需求。数据来自服务器本地 leads.jsonl。</p>
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
              placeholder="搜索公司、官网、产品、市场、联系人..."
            />
            <button className="secondaryBtn" onClick={() => loadLeads()} disabled={isLoading}>刷新</button>
          </div>
        )}

        {isAuthed && (
          <div className="leadList">
            {filteredLeads.length === 0 ? (
              <div className="emptyState">暂无匹配线索。</div>
            ) : (
              filteredLeads.map((lead, index) => (
                <article className="leadCard" key={`${lead.submittedAt}-${lead.email}-${index}`}>
                  <div className="leadTop">
                    <div>
                      <p className="leadTime">{new Date(lead.submittedAt).toLocaleString('zh-CN')}</p>
                      <h2>{lead.company}</h2>
                    </div>
                    <span>{lead.status || '新提交'}</span>
                  </div>
                  <div className="leadGrid">
                    <div><b>官网</b><a href={lead.website} target="_blank" rel="noreferrer">{lead.website}</a></div>
                    <div><b>产品/服务</b><p>{lead.product}</p></div>
                    <div><b>目标市场</b><p>{lead.market}</p></div>
                    <div><b>当前问题</b><p>{lead.problem}</p></div>
                    <div><b>联系人</b><p>{lead.contactName}</p></div>
                    <div><b>邮箱</b><a href={`mailto:${lead.email}`}>{lead.email}</a></div>
                    <div><b>WhatsApp / 微信</b><p>{lead.messenger || '未填写'}</p></div>
                    <div><b>补充说明</b><p>{lead.note || '未填写'}</p></div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}
