'use client';

import { useState } from 'react';
import FeatureTabs from './components/FeatureTabs';
import SeoToolCards from './components/SeoToolCards';
import SeoAuditForm from './seo-audit-form';

const quickAccess = [
  { href: '/tools/domain-overview', title: 'Domain Overview', desc: '站点健康度与可抓取性' },
  { href: '/tools/traffic-analysis', title: 'Traffic Analysis', desc: '自然流量趋势 AI estimate' },
  { href: '/tools/keyword-analysis', title: 'Keyword Analysis', desc: '关键词机会与内容缺口' },
  { href: '/tools/competitor-compare', title: 'Competitor Compare', desc: '竞品页面与增长差距' }
];

const portalStats = [
  { label: 'Interactive SEO tools', value: '7' },
  { label: 'AI estimate reports', value: '24/7' },
  { label: 'B2B growth roadmap', value: '90d' }
];

export default function HomePage() {
  const [domain, setDomain] = useState('');

  const openAudit = () => {
    document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="hpv32Home hpv34PortalHome">
      <header className="hpv32NavWrap hpv34NavWrap">
        <div className="hpv32Container hpv32Nav hpv34Nav">
          <a href="#" className="hpv32Logo hpv34Logo" aria-label="Moyag AI home">
            <span className="hpv34LogoMark">M</span>
            <span>Moyag AI</span>
          </a>
          <nav>
            <a href="#seo-tools">SEO Tools</a>
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#audit-form">AI Report</a>
          </nav>
          <button type="button" className="hpv34NavCta" onClick={openAudit}>Get audit</button>
        </div>
      </header>

      <section className="hpv32Hero hpv34Hero">
        <div className="hpv32Container hpv32HeroGrid hpv34HeroGrid">
          <div className="hpv34HeroCopy">
            <p className="hpv32Eyebrow hpv34Eyebrow">Moyag Digital SEO Services Portal</p>
            <h1><span>AI SEO Agent</span> for global B2B growth</h1>
            <p>把官网检测、关键词分析、竞品对比、外链评估和市场洞察整合成一个更清晰的数字服务入口，帮助外贸企业更快判断 Google SEO 增长机会。</p>
            <div className="hpv32HeroInput hpv34HeroInput">
              <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Enter domain, e.g. example.com" />
              <button type="button" className="hpv32MainBtn hpv34MainBtn" onClick={openAudit}>Start AI SEO Audit</button>
            </div>
            <div className="hpv34HeroStats" aria-label="Moyag portal stats">
              {portalStats.map((item) => (
                <article key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="hpv32OrbWrap hpv34PortalPanelWrap">
            <div className="hpv34PortalPanel">
              <div className="hpv34PanelTop">
                <span className="hpv34LiveDot" />
                <p>AI Estimate Service Center</p>
              </div>
              <div className="hpv34ScoreRing"><span>86</span><small>SEO health</small></div>
              <div className="hpv34MiniServiceGrid">
                <a href="/tools/domain-overview">Domain</a>
                <a href="/tools/traffic-analysis">Traffic</a>
                <a href="/tools/keyword-analysis">Keyword</a>
                <a href="/tools/domain-gap">Gap</a>
              </div>
              <div className="hpv34InsightCard">
                <span>Next best action</span>
                <b>Build keyword clusters + improve landing pages</b>
              </div>
            </div>
            <article className="hpv32FloatCard hpv32CardA hpv34FloatCard"><span>Organic Traffic</span><b>+178%</b></article>
            <article className="hpv32FloatCard hpv32CardB hpv34FloatCard"><span>Keywords</span><b>3.2K</b></article>
          </div>
        </div>
      </section>

      <section className="hpv34QuickAccess" aria-label="Quick access SEO services">
        <div className="hpv32Container hpv34QuickGrid">
          {quickAccess.map((item) => (
            <a key={item.href} href={item.href} className="hpv34QuickCard">
              <span>{item.title}</span>
              <p>{item.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="hpv34SectionIntro" id="services">
        <div className="hpv32Container hpv34SectionIntroInner">
          <p className="hpv32Eyebrow hpv34Eyebrow">Service Architecture</p>
          <h2>像数字政务门户一样，把复杂 SEO 服务拆成清晰入口</h2>
          <p>用户先选择检测工具，再获取 AI estimate 结果，最后进入完整 AI SEO 报告与付费转化路径。</p>
        </div>
      </section>

      <FeatureTabs active={0} setActive={() => undefined} />
      <SeoToolCards />

      <section className="hpv32Section hpv34PricingSection" id="pricing">
        <div className="hpv32Container">
          <div className="hpv32SectionHead hpv34SectionHead">
            <p className="hpv32Eyebrow hpv34Eyebrow">Pricing</p>
            <h2>从检测报告到获客诊断</h2>
            <p>保留低门槛检测产品，同时引导客户进入更完整的 SEO Agent 服务。</p>
          </div>
          <div className="hpv32Pricing hpv34Pricing">
            <article>
              <span className="hpv34PlanTag">Starter</span>
              <h3>基础 SEO 检测报告</h3>
              <strong>¥50</strong>
              <p>适合快速判断官网基础 SEO 健康度。</p>
            </article>
            <article className="hpv34PlanFeatured">
              <span className="hpv34PlanTag">Growth</span>
              <h3>进阶 SEO 获客诊断</h3>
              <strong>¥100</strong>
              <p>适合需要关键词、竞品和获客路径建议的外贸企业。</p>
            </article>
          </div>
          <p className="hpv32Contact hpv34Contact">微信/电话：17667442919 ｜ WhatsApp：+86 18842600869</p>
        </div>
      </section>

      <section className="hpv32Section hpv34AuditSection" id="audit-form">
        <div className="hpv32Container hpv34AuditGrid">
          <div className="hpv34AuditCopy">
            <p className="hpv32Eyebrow hpv34Eyebrow">AI Report</p>
            <h2>提交官网，生成完整 AI SEO 检测线索</h2>
            <p>系统会继续保留你现有的线索收集、AI 报告展示和后台能力，只把前端体验升级成更可信、更像专业 SaaS 的服务门户。</p>
          </div>
          <div className="hpv34AuditFormCard"><SeoAuditForm /></div>
        </div>
      </section>

      <footer className="hpv34Footer">
        <div className="hpv32Container hpv34FooterInner">
          <b>Moyag AI</b>
          <span>AI SEO Agent for global B2B brands</span>
        </div>
      </footer>
    </main>
  );
}
