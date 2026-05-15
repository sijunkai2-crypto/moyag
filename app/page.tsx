'use client';

import { useMemo, useState } from 'react';
import FeatureTabs from './components/FeatureTabs';
import SeoAuditForm from './seo-audit-form';

const trustMetrics = [
  ['SEO Score', '78', '+9%'],
  ['Keyword Gap', '128', '-14'],
  ['Backlink Risk', 'Low-Med', 'Stable'],
  ['Growth Opportunities', '36', '+11']
];

export default function HomePage() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const preview = useMemo(() => {
    const clean = domain.replace(/^https?:\/\//, '').trim() || 'yourdomain.com';
    const seed = clean.length || 10;
    return {
      name: clean,
      health: 65 + (seed % 28),
      visibility: 40 + (seed % 42),
      opportunities: 14 + (seed % 33),
      issues: 4 + (seed % 11),
      backlink: ['Low', 'Low-Medium', 'Medium'][seed % 3],
      market: 55 + (seed % 33),
      conversion: 50 + (seed % 41)
    };
  }, [domain]);

  const runDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 900);
  };

  return (
    <main className="hpv27Home">
      <section className="hpv27Hero">
        <div className="hpv27Container hpv27HeroGrid">
          <div>
            <p className="hpv27Eyebrow">AI SEO Intelligence Platform</p>
            <h1>外贸 Google SEO 获客增长工具</h1>
            <p className="hpv27Muted">为 B2B 制造商、跨境服务商、SaaS 团队提供可执行的 SEO 诊断与增长建议。</p>
            <div className="hpv27Search glass">
              <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="输入域名，如 example.com" />
              <button type="button" onClick={runDemo} disabled={loading}>{loading ? '分析中...' : '开始 AI SEO 分析'}</button>
            </div>
            <div className="hpv27Actions">
              <button type="button" className="ghost" onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}>生成完整报告</button>
              <button type="button" className="ghost" onClick={() => setExpanded((v) => !v)}>{expanded ? '收起预览' : '展开预览'}</button>
            </div>
          </div>
          <aside className="glass hpv27Preview">
            <h3>AI SEO Dashboard Preview</h3>
            <p>{preview.name}</p>
            <div className="hpv27MetricGrid">
              <div><span>SEO Health Score</span><b>{preview.health}</b></div>
              <div><span>Organic Visibility</span><b>{preview.visibility}%</b></div>
              <div><span>Keyword Opportunities</span><b>{preview.opportunities}</b></div>
              <div><span>Technical Issues</span><b>{preview.issues}</b></div>
            </div>
            {expanded && <ul><li>Backlink Signals: {preview.backlink}</li><li>Market Fit: {preview.market}/100</li><li>Conversion Readiness: {preview.conversion}/100</li></ul>}
          </aside>
        </div>
      </section>

      <section className="hpv27Section">
        <div className="hpv27Container hpv27TrustGrid">
          {trustMetrics.map((m) => <article key={m[0]} className="glass"><span>{m[0]}</span><b>{m[1]}</b><em>{m[2]}</em></article>)}
        </div>
      </section>

      <FeatureTabs active={activeTab} setActive={setActiveTab} />

      <section className="hpv27Section">
        <div className="hpv27Container">
          <div className="glass hpv27Pricing">
            <h2>Pricing & Contact</h2>
            <div className="hpv27PriceGrid">
              <article><h3>基础 SEO 检测报告</h3><strong>¥50</strong><p>适合快速识别官网 SEO 基础问题。</p></article>
              <article><h3>进阶 SEO 获客诊断</h3><strong>¥100</strong><p>适合获取完整的增长路径和优先级策略。</p></article>
            </div>
            <p>微信/电话：17667442919 ｜ WhatsApp：+86 18842600869</p>
          </div>
        </div>
      </section>

      <section className="hpv27Section" id="audit-form">
        <div className="hpv27Container">
          <h2>生成完整 AI SEO 报告</h2>
          <p className="hpv27Muted">继续沿用当前已上线的检测、线索保存与后台查看流程。</p>
          <SeoAuditForm />
        </div>
      </section>
    </main>
  );
}
