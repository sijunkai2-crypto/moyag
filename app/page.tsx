'use client';

import { useState } from 'react';
import FeatureTabs from './components/FeatureTabs';
import SeoToolCards from './components/SeoToolCards';
import SeoAuditForm from './seo-audit-form';

export default function HomePage() {
  const [domain, setDomain] = useState('');

  return (
    <main className="hpv32Home">
      <header className="hpv32NavWrap">
        <div className="hpv32Container hpv32Nav">
          <a href="#" className="hpv32Logo">Moyag AI</a>
          <nav><a href="#seo-tools">SEO Tools</a><a href="#pricing">Pricing</a><a href="#audit-form">AI Report</a></nav>
        </div>
      </header>

      <section className="hpv32Hero">
        <div className="hpv32Container hpv32HeroGrid">
          <div>
            <h1><span>AI SEO</span> Growth Platform for Global B2B Brands</h1>
            <p>Analyze your website SEO health, discover keyword opportunities, compare competitors, and get a custom growth roadmap powered by AI.</p>
            <div className="hpv32HeroInput">
              <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Enter domain (e.g. example.com)" />
              <button type="button" className="hpv32MainBtn" onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}>Start AI SEO Audit</button>
            </div>
          </div>
          <div className="hpv32OrbWrap">
            <div className="hpv32Orb" />
            <article className="hpv32FloatCard hpv32CardA"><span>SEO Score</span><b>86</b></article>
            <article className="hpv32FloatCard hpv32CardB"><span>Organic Traffic</span><b>+178%</b></article>
            <article className="hpv32FloatCard hpv32CardC"><span>Keywords</span><b>3.2K</b></article>
          </div>
        </div>
      </section>

      <FeatureTabs active={0} setActive={() => undefined} />
      <SeoToolCards />

      <section className="hpv32Section" id="pricing"><div className="hpv32Container hpv32Pricing"><article><h3>基础 SEO 检测报告</h3><strong>¥50</strong></article><article><h3>进阶 SEO 获客诊断</h3><strong>¥100</strong></article></div><p className="hpv32Contact">微信/电话：17667442919 ｜ WhatsApp：+86 18842600869</p></section>

      <section className="hpv32Section" id="audit-form"><div className="hpv32Container"><div className="hpv32SectionHead"><h2>完整 AI SEO 检测表单</h2></div><SeoAuditForm /></div></section>
    </main>
  );
}
