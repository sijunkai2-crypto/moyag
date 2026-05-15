'use client';

import { useState } from 'react';
import SeoToolCards from './components/SeoToolCards';
import SeoAuditForm from './seo-audit-form';

export default function HomePage() {
  const [domain, setDomain] = useState('');
  return (
    <main className="hpv32Home hpv33Home">
      <header className="hpv33NavWrap"><div className="hpv32Container hpv33Nav"><a href="#" className="hpv32Logo">Moyag AI</a><nav><a href="#why">Why Moyag</a><a href="#features">Features</a><a href="#seo-tools">SEO Tools</a><a href="#pricing">Pricing</a><a href="#audit-form">AI Report</a></nav><button className="hpv32MainBtn" onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}>Get My Report</button></div></header>
      <section className="hpv33Hero"><div className="hpv32Container hpv33HeroLayout"><div className="hpv33HeroContent"><h1><span>AI SEO</span> Growth Platform for Global B2B Brands</h1><p>Analyze your website SEO health, discover keyword opportunities, compare competitors, and get a custom growth roadmap powered by AI.</p><div className="hpv32HeroInput"><input value={domain} onChange={(e)=>setDomain(e.target.value)} placeholder="Enter domain" /><button className="hpv32MainBtn" onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}>Start AI SEO Audit</button></div></div><div className="hpv33OrbStage"><div className="hpv33OrbCore"><em /><em /><em /></div><article className="hpv32FloatCard hpv33f1"><span>SEO Score</span><b>86</b></article><article className="hpv32FloatCard hpv33f2"><span>Keyword Gap</span><b>136</b></article><article className="hpv32FloatCard hpv33f3"><span>Traffic Potential</span><b>+178%</b></article></div></div></section>
      <section className="hpv32Section" id="features"><div className="hpv32Container hpv33Dash"><div className="hpv33Glass big"><h3>Dashboard Preview</h3><p>AI estimate / simulated preview</p><div className="hpv33Ring">86</div><ul><li>Top Issues: Missing alt on 6 images</li><li>Keyword Opportunities: 42</li><li>Backlink Signals: Low-Medium</li><li>Market Fit: 73/100</li></ul></div><div className="hpv33Stack"><div className="hpv33Glass"><b>SEO Score</b><p>Strong technical baseline</p></div><div className="hpv33Glass"><b>Top Issues</b><p>Meta depth and CTA placement</p></div></div></div></section>
      <SeoToolCards />
      <section className="hpv32Section" id="pricing"><div className="hpv32Container hpv32Pricing"><article className="hpv33Glass"><h3>基础 SEO 检测报告</h3><strong>¥50</strong></article><article className="hpv33Glass"><h3>进阶 SEO 获客诊断</h3><strong>¥100</strong></article></div><p className="hpv32Contact">微信/电话：17667442919 ｜ WhatsApp：+86 18842600869</p></section>
      <section className="hpv32Section" id="audit-form"><div className="hpv32Container"><SeoAuditForm /></div></section>
    </main>
  );
}
