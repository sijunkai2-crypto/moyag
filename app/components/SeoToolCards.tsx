'use client';

const tools = [
  { href: '/tools/domain-overview', title: 'Domain Overview', desc: '快速查看站点结构、可抓取性与可见性健康度。' },
  { href: '/tools/traffic-analysis', title: 'Traffic Analysis', desc: '通过 AI 估算自然流量趋势、入口页增长与波动风险。' },
  { href: '/tools/keyword-analysis', title: 'Keyword Analysis', desc: '识别高意图关键词机会、内容缺口与词群覆盖度。' },
  { href: '/tools/competitor-compare', title: 'Competitor Compare', desc: '对比竞品内容深度、转化路径与页面策略差距。' },
  { href: '/tools/backlink-check', title: 'Backlink Check', desc: '模拟评估外链质量信号、风险与品牌提及机会。' },
  { href: '/tools/market-analysis', title: 'Market Analysis', desc: '分析目标市场匹配度、本地化内容和增长潜力。' },
  { href: '/tools/domain-gap', title: 'Domain Gap', desc: '定位你与竞品在关键词和落地页层面的差距。' }
];

export default function SeoToolCards() {
  return (
    <section className="hpv32Section" id="seo-tools">
      <div className="hpv32Container">
        <div className="hpv32SectionHead">
          <p className="hpv32Eyebrow">SEO Tools</p>
          <h2>7 个 AI SEO 增长工具</h2>
          <p>以下为 AI estimate / simulated preview，用于展示分析结构与增长方向，不承诺真实 Semrush 数据。</p>
        </div>
        <div className="hpv32ToolGrid">
          {tools.map((tool) => (
            <a key={tool.href} href={tool.href} className="hpv32ToolCard">
              <span className="hpv32ToolBadge">AI Preview</span>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
              <b>Open Tool →</b>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
