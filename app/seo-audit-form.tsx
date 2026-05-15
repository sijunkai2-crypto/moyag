'use client';

import { FormEvent, useState } from 'react';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';
type AiReport = { score: number; riskLevel: string; issueCount: number; highPriorityCount: number; executiveSummary: string; sections: Array<{ title: string; summary: string; items: string[] }>; roadmap: { day7: string[]; day30: string[]; day90: string[] } };

export default function SeoAuditForm() {
  const [status, setStatus] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const [report, setReport] = useState<AiReport | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading'); setMessage(''); setReport(null);
    const fd = new FormData(event.currentTarget);
    const payload = { companyName: fd.get('company'), url: fd.get('website'), industry: fd.get('product'), targetMarket: fd.get('market'), contactName: fd.get('contactName'), email: fd.get('email'), phone: fd.get('messenger') };
    try {
      const response = await fetch('/api/ai-seo-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '提交失败，请稍后再试。');
      setReport(data.aiReport); setStatus('success'); setMessage('检测完成，已生成 AI SEO 报告。');
    } catch (error) {
      setStatus('error'); setMessage(error instanceof Error ? error.message : '提交失败，请稍后再试。');
    }
  }

  return (<>
    <form className="auditForm hpv31FormCard" onSubmit={handleSubmit}>
      <label>公司名称<input name="company" required /></label><label>官网链接<input name="website" required type="url" placeholder="https://example.com" /></label>
      <label>主营产品 / 服务<input name="product" required /></label><label>目标市场<input name="market" required /></label>
      <label>联系人<input name="contactName" required /></label><label>邮箱<input name="email" required type="email" /></label>
      <label className="full">WhatsApp / 微信<input name="messenger" placeholder="可选" /></label>
      <button className="submitBtn" disabled={status === 'loading'} type="submit">{status === 'loading' ? 'AI 检测中...' : '提交官网检测'}</button>
      {message && <p className={`formMessage ${status}`}>{message}</p>}
    </form>
    {report && (
      <section className="reportBox hpv31FormCard" style={{ marginTop: 24 }}>
        <h3>AI SEO 诊断报告（中文）</h3>
        <p><b>总分：</b>{report.score} / 100 ｜ <b>风险等级：</b>{report.riskLevel}</p>
        <p><b>核心问题：</b>{report.issueCount} 项（高优先级 {report.highPriorityCount} 项）</p>
        <p>{report.executiveSummary}</p>
        {report.sections.map((s) => <div key={s.title}><h4>{s.title}</h4><p>{s.summary}</p><ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul></div>)}

        <h4>7 / 30 / 90 天执行计划</h4>
        <div className="hpv31RoadmapGrid">
          <article className="hpv31RoadmapCard">
            <b>7 天计划</b>
            <ul>
              {(Array.isArray(report.roadmap?.day7) && report.roadmap.day7.length ? report.roadmap.day7 : ['暂无计划项']).map((item, idx) => (
                <li key={`day7-${idx}`}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="hpv31RoadmapCard">
            <b>30 天计划</b>
            <ul>
              {(Array.isArray(report.roadmap?.day30) && report.roadmap.day30.length ? report.roadmap.day30 : ['暂无计划项']).map((item, idx) => (
                <li key={`day30-${idx}`}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="hpv31RoadmapCard">
            <b>90 天计划</b>
            <ul>
              {(Array.isArray(report.roadmap?.day90) && report.roadmap.day90.length ? report.roadmap.day90 : ['暂无计划项']).map((item, idx) => (
                <li key={`day90-${idx}`}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    )}
  </>);
}
