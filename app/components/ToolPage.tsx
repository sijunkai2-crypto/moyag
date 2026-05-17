import SeoAuditForm from '../seo-audit-form';
import ToolAnalyzer from './ToolAnalyzer';
import styles from './ToolPage.module.css';
import extras from './ToolPageExtras.module.css';

type ToolPageProps = {
  name: string;
  summary: string;
  features: string[];
  toolType: string;
};

const relatedTools = [
  { href: '/tools/domain-overview', label: 'Domain' },
  { href: '/tools/traffic-analysis', label: 'Traffic' },
  { href: '/tools/keyword-analysis', label: 'Keyword' },
  { href: '/tools/competitor-compare', label: 'Compare' },
  { href: '/tools/backlink-check', label: 'Backlink' },
  { href: '/tools/market-analysis', label: 'Market' },
  { href: '/tools/domain-gap', label: 'Gap' }
];

const semrushStyleTools = [
  { href: '/tools/domain-overview#tool-analyzer', tag: 'SEO', title: 'Site Audit', desc: '检测站点健康度、页面结构、索引与抓取问题。' },
  { href: '/tools/domain-overview#tool-analyzer', tag: 'SEO', title: 'Domain Overview', desc: '查看域名整体 SEO 基线、可见性与增长空间。' },
  { href: '/tools/traffic-analysis#tool-analyzer', tag: 'Traffic', title: 'Traffic Analytics', desc: '估算自然流量来源、入口页表现与波动风险。' },
  { href: '/tools/keyword-analysis#tool-analyzer', tag: 'Keyword', title: 'Keyword Magic Tool', desc: '生成关键词机会、内容主题和高意图词群。' },
  { href: '/tools/keyword-analysis#tool-analyzer', tag: 'Content', title: 'Content Gap', desc: '识别你还没有覆盖的产品词、场景词和问题词。' },
  { href: '/tools/competitor-compare#tool-analyzer', tag: 'Competitive', title: 'Competitor Research', desc: '对比竞品页面结构、转化路径和内容深度。' },
  { href: '/tools/domain-gap#tool-analyzer', tag: 'Gap', title: 'Keyword Gap', desc: '定位你和竞品之间的关键词缺口与落地页缺口。' },
  { href: '/tools/backlink-check#tool-analyzer', tag: 'Link', title: 'Backlink Analytics', desc: '评估外链质量、品牌提及和潜在风险信号。' },
  { href: '/tools/backlink-check#tool-analyzer', tag: 'Link', title: 'Link Building', desc: '发现外链建设方向、合作页面和行业资源机会。' },
  { href: '/tools/market-analysis#tool-analyzer', tag: 'Market', title: 'Market Explorer', desc: '分析目标市场、本地化需求和增长潜力。' },
  { href: '/tools/traffic-analysis#tool-analyzer', tag: 'Rank', title: 'Position Tracking', desc: '模拟追踪重点词排名趋势与自然流量变化。' },
  { href: '/tools/domain-overview#tool-form', tag: 'Report', title: 'Full AI SEO Report', desc: '提交完整信息，进入 SEO 获客诊断与服务转化。' }
];

export default function ToolPage({ name, summary, features, toolType }: ToolPageProps) {
  return (
    <main className={`hpv34PortalHome hpv34ToolPortal ${styles.scope} ${extras.extras}`}>
      <header className="hpv32ToolNav hpv34NavWrap hpv34ToolNav">
        <div className="hpv32Container hpv32ToolNavInner hpv34ToolNavInner">
          <a href="/" className="hpv32Logo hpv34Logo" aria-label="Moyag AI home">
            <span className="hpv34LogoMark">M</span>
            <span>Moyag AI</span>
          </a>
          <nav className="hpv34ToolTopLinks">
            <a href="/">首页</a>
            <a href="#tool-analyzer">工具分析</a>
            <a href="#seo-toolkit">工具库</a>
            <a href="#tool-form">完整报告</a>
          </nav>
          <a href="/" className="hpv34NavCta hpv34ReturnHome">返回首页</a>
        </div>
      </header>

      <section className="hpv34ToolHero">
        <div className="hpv32Container hpv34ToolHeroGrid">
          <div className="hpv34ToolHeroCopy">
            <p className="hpv32Eyebrow hpv34Eyebrow">AI estimate / simulated preview</p>
            <h1>{name}</h1>
            <p>{summary}</p>
            <div className="hpv34ToolHeroActions">
              <a href="#tool-analyzer" className="hpv34PrimaryLink">Start analysis</a>
              <a href="#seo-toolkit" className="hpv34SecondaryLink">Explore toolkit</a>
            </div>
          </div>

          <aside className="hpv34ToolServicePanel" aria-label="Moyag SEO service center">
            <div className="hpv34PanelTop">
              <span className="hpv34LiveDot" />
              <p>Moyag SEO Service Center</p>
            </div>
            <div className="hpv34ToolBigMetric">
              <strong>12</strong>
              <span>Semrush-style SEO functions</span>
            </div>
            <div className="hpv34ToolChipGrid">
              {relatedTools.map((item) => (
                <a key={item.href} href={item.href}>{item.label}</a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="hpv34ToolFeatureSection">
        <div className="hpv32Container hpv34ToolFeatureGrid">
          {features.map((f, index) => (
            <article key={f} className="hpv34ServiceTile">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{f}</h3>
              <p>以门户式服务卡片呈现核心能力，当前为 AI estimate / simulated preview，用于展示优化策略结构。</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hpv34ToolAnalyzerSection" id="tool-analyzer">
        <div className="hpv32Container hpv34ToolAnalyzerGrid">
          <div className="hpv34ToolSectionCopy">
            <p className="hpv32Eyebrow hpv34Eyebrow">Tool Analysis</p>
            <h2>输入域名，生成门户式模拟分析结果</h2>
            <p>这里会调用 V3.3 已上线的工具 API，保留可输入域名与返回 AI estimate 结果的能力，同时把界面升级成你给的 Figma 数字服务风格。</p>
          </div>
          <ToolAnalyzer toolType={toolType} />
        </div>
      </section>

      <section className="hpv34ToolkitSection" id="seo-toolkit">
        <div className="hpv32Container">
          <div className="hpv34ToolkitHead">
            <p className="hpv32Eyebrow hpv34Eyebrow">SEO Toolkit</p>
            <h2>对标 Semrush 的 SEO 功能入口</h2>
            <p>所有卡片都有独立链接，点击后会进入对应可用工具页，用户可以直接输入域名并生成 AI estimate 结果。</p>
          </div>
          <div className="hpv34ToolkitGrid">
            {semrushStyleTools.map((tool) => (
              <a href={tool.href} className="hpv34ToolkitCard" key={`${tool.title}-${tool.href}`}>
                <span>{tool.tag}</span>
                <h3>{tool.title}</h3>
                <p>{tool.desc}</p>
                <b>Open tool →</b>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="hpv34ToolAuditSection" id="tool-form">
        <div className="hpv32Container hpv34AuditGrid">
          <div className="hpv34AuditCopy">
            <p className="hpv32Eyebrow hpv34Eyebrow">Full AI SEO Audit</p>
            <h2>需要完整 SEO 获客诊断时，继续提交完整表单</h2>
            <p>工具页负责快速预览，完整表单负责进入线索收集、报告生成和后续 SEO Agent 服务转化。</p>
          </div>
          <div className="hpv34AuditFormCard"><SeoAuditForm /></div>
        </div>
      </section>
    </main>
  );
}
