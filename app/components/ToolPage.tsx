import SeoAuditForm from '../seo-audit-form';
import ToolAnalyzer from './ToolAnalyzer';
import styles from './ToolPage.module.css';

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

export default function ToolPage({ name, summary, features, toolType }: ToolPageProps) {
  return (
    <main className={`hpv34PortalHome hpv34ToolPortal ${styles.scope}`}>
      <header className="hpv32ToolNav hpv34NavWrap hpv34ToolNav">
        <div className="hpv32Container hpv32ToolNavInner hpv34ToolNavInner">
          <a href="/" className="hpv32Logo hpv34Logo" aria-label="Moyag AI home">
            <span className="hpv34LogoMark">M</span>
            <span>Moyag AI</span>
          </a>
          <nav className="hpv34ToolTopLinks">
            <a href="/">首页</a>
            <a href="#tool-analyzer">工具分析</a>
            <a href="#tool-form">完整报告</a>
          </nav>
          <a href="/" className="hpv34NavCta">返回首页</a>
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
              <a href="#tool-form" className="hpv34SecondaryLink">Full AI SEO audit</a>
            </div>
          </div>

          <aside className="hpv34ToolServicePanel" aria-label="Moyag SEO service center">
            <div className="hpv34PanelTop">
              <span className="hpv34LiveDot" />
              <p>Moyag SEO Service Center</p>
            </div>
            <div className="hpv34ToolBigMetric">
              <strong>7</strong>
              <span>SEO tools connected</span>
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
