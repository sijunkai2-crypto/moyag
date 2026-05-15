'use client';

import { useMemo, useState } from 'react';
import FeatureTabs from './components/FeatureTabs';
import SeoToolCards from './components/SeoToolCards';
import SeoAuditForm from './seo-audit-form';

const trustTags = ['B2B Manufacturing', 'Cross-border SaaS', 'Google SEO', 'Alibaba.com', 'Made-in-China', 'Amazon'];

export default function HomePage() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const preview = useMemo(() => {
    const seed = (domain || 'example.com').replace(/^https?:\/\//, '').length;
    return { score: 86, traffic: `+${160 + seed}%`, kw: `${(3 + (seed % 3))}.${seed % 10}K`, issues: 4 + (seed % 8), ranked: `${2 + (seed % 3)}.${seed % 9}K` };
  }, [domain]);
  const runDemo = () => { setLoading(true); setTimeout(() => setLoading(false), 980); };

  return (
    <main className="hpv32Home">
      <header className="hpv32NavWrap"><div className="hpv32Container hpv32Nav"><a href="#" className="hpv32Logo">Moyag AI</a><nav><a href="#why">Why Moyag</a><a href="#features">Features</a><a href="#seo-tools">SEO Tools</a><a href="#case">Case Studies</a><a href="#pricing">Pricing</a><a href="#resources">Resources</a></nav><div className="hpv32NavBtns"><button className="hpv32LightBtn">EN</button><button className="hpv32LightBtn">Login</button><button className="hpv32MainBtn" onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}>Get My Report</button></div></div></header>

      <section className="hpv32Hero"><div className="hpv32Container hpv32HeroGrid"><div><p className="hpv32Eyebrow">AI SEO Intelligence Platform</p><h1><span>AI SEO</span> Growth Platform<br/>for Global B2B Brands</h1><p>Analyze your website SEO health, discover keyword opportunities, compare competitors, and get a custom growth roadmap powered by AI.</p><div className="hpv32HeroInput"><input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Enter your domain, e.g. example.com" /><button className="hpv32MainBtn" onClick={runDemo} disabled={loading}>{loading ? 'Analyzing...' : 'Start AI SEO Analysis'}</button></div></div><div className="hpv32EnergyWrap"><div className="hpv32EnergyOrb"/><div className="hpv32Ring"/><div className="hpv32Ring hpv32RingB"/><article className="hpv32Float hpv32F1"><b>SEO Score</b><span>{preview.score}</span></article><article className="hpv32Float hpv32F2"><b>Organic Traffic</b><span>{preview.traffic}</span></article><article className="hpv32Float hpv32F3"><b>Keywords</b><span>{preview.kw}</span></article></div></div></section>

      <section className="hpv32Trust"><div className="hpv32Container"><p>Trusted by growing businesses worldwide</p><div>{trustTags.map((t) => <span key={t}>{t}</span>)}</div></div></section>

      <section className="hpv32Section" id="features"><div className="hpv32Container"><div className="hpv32ValueGrid"><article><i/><h3>AI-Powered Analysis</h3><p>Fast diagnostic intelligence from site structure and content signals.</p></article><article><i/><h3>Actionable Roadmap</h3><p>Prioritized 7/30/90-day plan for SEO and conversion growth.</p></article><article><i/><h3>Competitor Intelligence</h3><p>See market positioning and strategic content gaps quickly.</p></article><article><i/><h3>Growth Focused</h3><p>Built for B2B teams that care about pipeline, not vanity metrics.</p></article></div></div></section>

      <section className="hpv32Section" id="seo-tools"><div className="hpv32Container"><h2>Powerful SEO Tools</h2><SeoToolCards /></div></section>
      <FeatureTabs active={activeTab} setActive={setActiveTab} />

      <section className="hpv32Section"><div className="hpv32Container hpv32Dash"><aside><h4>Smarter Decisions</h4><h4>Faster Results</h4><h4>Better Rankings</h4><h4>Real Growth</h4></aside><article><h3>AI SEO Dashboard Preview</h3><p>Overall SEO Score: {preview.score}</p><p>Top Issues: {preview.issues}</p><p>Organic Traffic: {preview.traffic}</p><p>Keywords Ranked: {preview.ranked}</p><p>Backlinks: AI estimate</p></article><aside><button className="hpv32MainBtn" onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}>Get Your Custom AI SEO Report</button></aside></div></section>

      <section className="hpv32Section" id="pricing"><div className="hpv32Container"><h2>Simple, Transparent Pricing</h2><div className="hpv32Pricing"><article><h3>基础 SEO 检测报告</h3><strong>¥50</strong></article><article><h3>进阶 SEO 获客诊断</h3><strong>¥100</strong></article></div><p className="hpv32Contact">微信/电话：17667442919 ｜ WhatsApp：+86 18842600869<br/>需要 SEO 优化 Agent？联系客服获取定制方案。</p></div></section>

      <section className="hpv32Section" id="resources"><div className="hpv32Container"><h2>Newsletter / Stay Updated</h2><div className="hpv32HeroInput"><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" /><button className="hpv32LightBtn">Subscribe</button></div></div></section>

      <section className="hpv32Section" id="audit-form"><div className="hpv32Container"><SeoAuditForm /></div></section>
    </main>
  );
}
