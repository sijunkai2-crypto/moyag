'use client';

const tools = [
  { href: '/tools/domain-overview#tool-analyzer', tag: 'SEO', title: 'Site Audit', desc: '检测站点健康度、页面结构、索引与抓取问题。' },
  { href: '/tools/domain-overview#tool-analyzer', tag: 'Domain', title: 'Domain Overview', desc: '快速查看站点结构、可抓取性与可见性健康度。' },
  { href: '/tools/traffic-analysis#tool-analyzer', tag: 'Traffic', title: 'Traffic Analytics', desc: '通过 AI 估算自然流量趋势、入口页增长与波动风险。' },
  { href: '/tools/keyword-analysis#tool-analyzer', tag: 'Keyword', title: 'Keyword Magic Tool', desc: '识别高意图关键词机会、内容缺口与词群覆盖度。' },
  { href: '/tools/keyword-analysis#tool-analyzer', tag: 'Content', title: 'Content Gap', desc: '识别你还没有覆盖的产品词、场景词和问题词。' },
  { href: '/tools/competitor-compare#tool-analyzer', tag: 'Research', title: 'Competitor Research', desc: '对比竞品内容深度、转化路径与页面策略差距。' },
  { href: '/tools/domain-gap#tool-analyzer', tag: 'Gap', title: 'Keyword Gap', desc: '定位你与竞品在关键词和落地页层面的差距。' },
  { href: '/tools/backlink-check#tool-analyzer', tag: 'Link', title: 'Backlink Analytics', desc: '模拟评估外链质量信号、风险与品牌提及机会。' },
  { href: '/tools/backlink-check#tool-analyzer', tag: 'Link', title: 'Link Building', desc: '发现外链建设方向、合作页面和行业资源机会。' },
  { href: '/tools/market-analysis#tool-analyzer', tag: 'Market', title: 'Market Explorer', desc: '分析目标市场匹配度、本地化内容和增长潜力。' },
  { href: '/tools/traffic-analysis#tool-analyzer', tag: 'Rank', title: 'Position Tracking', desc: '模拟追踪重点词排名趋势与自然流量变化。' },
  { href: '/tools/domain-overview#tool-form', tag: 'Report', title: 'Full AI SEO Report', desc: '提交完整信息，进入 SEO 获客诊断与服务转化。' }
];

export default function SeoToolCards() {
  return (
    <section className="hpv32Section hpv34ToolkitSection" id="seo-tools">
      <div className="hpv32Container">
        <div className="hpv32SectionHead hpv34ToolkitHead">
          <p className="hpv32Eyebrow hpv34Eyebrow">SEO Toolkit</p>
          <h2>对标 Semrush 的 AI SEO 工具库</h2>
          <p>每个功能都有独立入口，并连接到当前可直接输入域名使用的 AI estimate 工具页。</p>
        </div>
        <div className="hpv32ToolGrid hpv34ToolkitGrid">
          {tools.map((tool) => (
            <a key={`${tool.title}-${tool.href}`} href={tool.href} className="hpv32ToolCard hpv34ToolkitCard">
              <span className="hpv32ToolBadge">{tool.tag}</span>
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
