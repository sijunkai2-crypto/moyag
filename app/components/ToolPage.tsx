import SeoAuditForm from '../seo-audit-form';
import ToolAnalyzer from './ToolAnalyzer';

type ToolPageProps = {
  name: string;
  summary: string;
  features: string[];
  toolType: string;
};

export default function ToolPage({ name, summary, features, toolType }: ToolPageProps) {
  return (
    <main className="hpv32ToolPage">
      <header className="hpv32ToolNav">
        <div className="hpv32Container hpv32ToolNavInner">
          <a href="/" className="hpv32Logo">Moyag AI</a>
          <a href="/" className="hpv32BackHome">← 返回首页</a>
        </div>
      </header>

      <section className="hpv32ToolHero hpv32Section">
        <div className="hpv32Container">
          <p className="hpv32Eyebrow">AI estimate / simulated preview</p>
          <h1>{name}</h1>
          <p>{summary}</p>
        </div>
      </section>

      <section className="hpv32Section">
        <div className="hpv32Container hpv32FeatureMiniGrid">
          {features.map((f) => (
            <article key={f} className="hpv32GlassCard">
              <h3>{f}</h3>
              <p>当前为 AI estimate / simulated preview，仅用于展示优化策略结构。</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hpv32Section" id="tool-analyzer">
        <div className="hpv32Container">
          <div className="hpv32SectionHead">
            <p className="hpv32Eyebrow">Tool Analysis</p>
            <h2>输入并生成模拟分析结果</h2>
          </div>
          <ToolAnalyzer toolType={toolType} />
        </div>
      </section>

      <section className="hpv32Section" id="tool-form">
        <div className="hpv32Container">
          <div className="hpv32SectionHead">
            <p className="hpv32Eyebrow">Full AI SEO Audit</p>
            <h2>返回首页同款完整检测表单</h2>
          </div>
          <SeoAuditForm />
        </div>
      </section>
    </main>
  );
}
