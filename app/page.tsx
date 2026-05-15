'use client';

import { useMemo, useState } from 'react';
import FeatureTabs from './components/FeatureTabs';
import SeoAuditForm from './seo-audit-form';

const trustTags = ['B2B Manufacturing', 'Cross-border SaaS', 'Google SEO', 'Alibaba', 'Made-in-China', 'Amazon'];

export default function HomePage() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const preview = useMemo(() => {
    const seed = (domain || 'example.com').replace(/^https?:\/\//, '').length;
    return {
      health: 72 + (seed % 19),
      visibility: 48 + (seed % 36),
      opportunities: 19 + (seed % 24),
      issues: 3 + (seed % 9),
      backlink: ['Low', 'Low-Medium', 'Medium'][seed % 3],
      market: 61 + (seed % 29),
      conversion: 56 + (seed % 31)
    };
  }, [domain]);

  const runDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 950);
  };

  return (
    <main className="hpv31Home">
      <header className="hpv31NavWrap">
        <div className="hpv31Container hpv31Nav">
          <a href="#" className="hpv31Logo">Moyag AI</a>
          <nav>
            <a href="#why">Why Moyag</a><a href="#features">Features</a><a href="#seo-tools">SEO Tools</a><a href="#pricing">Pricing</a>
          </nav>
          <div className="hpv31NavBtns"><button type="button" className="hpv31LightBtn">登录</button><button type="button" className="hpv31MainBtn" onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}>获取报告</button></div>
        </div>
      </header>

      <section className="hpv31Hero">
        <div className="hpv31Container hpv31HeroGrid">
          <div>
            <p className="hpv31Eyebrow">AI SEO Intelligence Platform</p>
            <h1>让外贸官网变成 <span>AI 驱动</span> 的 Google 获客系统</h1>
            <p>输入官网域名，Moyag AI 将分析 SEO 健康度、关键词机会、竞品差距、外链信号与市场增长路径。</p>
            <div className="hpv31HeroInput"><input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="输入域名 example.com" /><button type="button" className="hpv31MainBtn" onClick={runDemo} disabled={loading}>{loading ? '分析中...' : '开始 AI SEO 分析'}</button></div>
          </div>
          <div className="hpv31OrbArea"><div className="hpv31Orb" /><div className="hpv31OrbSmall" /><div className="hpv31Ribbon" /></div>
        </div>
      </section>

      <section className="hpv31Trust"><div className="hpv31Container"><p>We help many companies</p><div>{trustTags.map((item) => <span key={item}>{item}</span>)}</div></div></section>

      <section className="hpv31Section" id="why"><div className="hpv31Container hpv31MetricRow"><article><b>{preview.health}</b><span>SEO Health Score</span></article><article><b>{preview.visibility}%</b><span>AI visibility estimate</span></article><article><b>{preview.opportunities}</b><span>Keyword Opportunities</span></article><article><b>{preview.issues}</b><span>Technical Issues</span></article></div></section>

      <FeatureTabs active={activeTab} setActive={setActiveTab} />

      <section className="hpv31Section" id="features"><div className="hpv31Container hpv31CardGrid"><article className="hpv31FeatureCard"><i /><h3>Domain Overview</h3><p>快速理解站点抓取、结构与排名可见性状态。</p></article><article className="hpv31FeatureCard"><i /><h3>Keyword Intelligence</h3><p>定位更易转化的词群与内容扩展方向。</p></article><article className="hpv31FeatureCard"><i /><h3>Competitor & Backlink Signals</h3><p>识别竞品差距与外链风险，减少盲目优化。</p></article></div></section>

      <section className="hpv31Section"><div className="hpv31Container hpv31Mid"><aside><h4>Less Guesswork, More Growth</h4><h4>Keywords That Convert</h4></aside><article><h3>AI SEO Dashboard Preview</h3><p>Backlink Signals: {preview.backlink} · Market Fit: {preview.market}/100 · Conversion Readiness: {preview.conversion}/100</p><p>Simulated preview now. 接入 GSC/GA4 后可显示真实数据。</p></article><aside><h4>Competitors In Sight</h4><h4>Reports That Sell</h4></aside></div></section>

      <section className="hpv31Section" id="pricing"><div className="hpv31Container"><div className="hpv31Pricing"><article><h3>基础 SEO 检测报告</h3><strong>¥50</strong><p>适合快速识别官网 SEO 基础问题。</p></article><article><h3>进阶 SEO 获客诊断</h3><strong>¥100</strong><p>适合获取完整增长路径与优先级建议。</p></article></div><p className="hpv31Contact">微信/电话：17667442919 ｜ WhatsApp：+86 18842600869<br />需要 SEO 优化 Agent？联系客服获取定制方案。</p></div></section>

      <section className="hpv31Section" id="audit-form"><div className="hpv31Container"><div className="hpv31SectionHead"><p className="hpv31Eyebrow">Full Report</p><h2>提交完整信息，生成 AI SEO 报告</h2></div><SeoAuditForm /></div></section>

      <footer className="hpv31Footer"><div className="hpv31Container hpv31FooterGrid"><div><h4>Product</h4><a href="#features">Platform</a></div><div><h4>SEO Tools</h4><a href="#seo-tools">Tool Stack</a></div><div><h4>Services</h4><a href="#pricing">Audit Plans</a></div><div><h4>Contact</h4><p>17667442919</p></div></div><p>© Moyag AI</p></footer>
    </main>
  );
}
