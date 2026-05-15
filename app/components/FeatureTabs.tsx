'use client';

const features = [
  { key: 'domain', label: 'Domain Overview', summary: '聚合域名健康度、可见性与收录信号，快速判断 SEO 基线。', values: ['SEO Health Score: 78/100', 'Indexability Signals: Stable', 'Top Priority: 内容结构优化'] },
  { key: 'traffic', label: 'Traffic Analysis', summary: '基于站点结构与页面表现估算自然流量成长潜力。', values: ['Organic Visibility Estimate: +22%', 'Entry Pages: 18', 'Bounce Risk: Medium'] },
  { key: 'keyword', label: 'Keyword Analysis', summary: '识别核心词、长尾词与商业意图词的覆盖缺口。', values: ['Keyword Opportunities: 36', 'Commercial Intent Coverage: 42%', 'Missing Cluster: 5'] },
  { key: 'competitor', label: 'Competitor Compare', summary: '对比竞品内容密度、页面布局和转化路径信号。', values: ['Competitor Gap: 12 pages', 'CTA Density: Below Avg', 'Schema Usage: Needs Improvement'] },
  { key: 'backlink', label: 'Backlink Check', summary: '提供外链质量风险提示与品牌提及机会。', values: ['Backlink Risk: Low-Medium', 'Referring Domains: Simulated 54', 'Unlinked Mentions: 9'] },
  { key: 'market', label: 'Market Analysis', summary: '从目标市场语言、内容匹配度评估获客适配性。', values: ['Market Fit: 71/100', 'Localized Content Ratio: 38%', 'Region Opportunity: North America'] },
  { key: 'gap', label: 'Domain Gap', summary: '找出你与竞品在关键词与着陆页维度的结构差距。', values: ['Domain Gap Score: 64', 'Keyword Gap: 128', 'Landing Page Gap: 14'] }
];

export default function FeatureTabs({ active, setActive }: { active: number; setActive: (index: number) => void }) {
  return (
    <section className="hpv27Section" id="tools">
      <div className="hpv27Container">
        <h2>SEO Intelligence Tool Stack</h2>
        <p className="hpv27Muted">轻量版 Semrush 对标结构：先做可执行洞察，再引导完整 AI SEO 检测。</p>
        <div className="hpv27TabsWrap">
          <div className="hpv27Tabs">
            {features.map((feature, idx) => (
              <button type="button" key={feature.key} className={`hpv27Tab ${idx === active ? 'active' : ''}`} onClick={() => setActive(idx)}>
                {feature.label}
              </button>
            ))}
          </div>
          <article className="hpv27Panel glass">
            <h3>{features[active].label}</h3>
            <p>{features[active].summary}</p>
            <ul>
              {features[active].values.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
