'use client';

const features = [
  { key: 'domain', label: 'Domain Overview', summary: '统一查看 SEO 健康度、页面抓取稳定性与可见性趋势，快速建立优化基线。', values: ['AI visibility estimate: +18%', 'Indexability Status: Stable', 'Primary Action: 信息架构优化'] },
  { key: 'traffic', label: 'Traffic Analysis', summary: '基于站点结构与内容覆盖做增长模拟，识别高价值入口页与潜在损耗点。', values: ['Simulated organic sessions: 12.4k/mo', 'Entry pages in growth path: 26', 'Traffic risk signals: Medium'] },
  { key: 'keyword', label: 'Keyword Analysis', summary: '定位高商业意图关键词、场景词与长尾词缺口，输出可执行内容方向。', values: ['Keyword opportunities: 42', 'Commercial intent coverage: 47%', 'Missing clusters: 6'] },
  { key: 'competitor', label: 'Competitor Compare', summary: '对比竞品的页面布局、内容深度与转化入口，帮助你更快找到超越路径。', values: ['Competitor content gap: 14 pages', 'CTA clarity score: 61/100', 'Schema adoption gap: Moderate'] },
  { key: 'backlink', label: 'Backlink Check', summary: '提供外链信号与风险提示，识别可拓展的品牌提及与行业引用机会。', values: ['Backlink risk: Low-Medium', 'Referring domains (simulated): 68', 'Brand mention opportunities: 11'] },
  { key: 'market', label: 'Market Analysis', summary: '按目标市场语言和购买阶段，评估内容适配性与国际化增长潜力。', values: ['Market fit score: 73/100', 'Localized page ratio: 41%', 'Best next market: North America'] },
  { key: 'gap', label: 'Domain Gap', summary: '比较你与核心竞品在关键词、着陆页与转化要素上的结构差异。', values: ['Domain gap index: 66', 'Keyword gap count: 136', 'Landing page gap: 17'] }
];

export default function FeatureTabs({ active, setActive }: { active: number; setActive: (index: number) => void }) {
  return (
    <section className="hpv31Section" id="seo-tools">
      <div className="hpv31Container">
        <div className="hpv31SectionHead">
          <p className="hpv31Eyebrow">SEO Tools</p>
          <h2>Semrush-Style Structure, Moyag AI Execution</h2>
          <p>当前为 simulated preview。接入 GSC / GA4 后可显示真实业务数据与趋势。</p>
        </div>
        <div className="hpv31Tabs">
          {features.map((feature, idx) => (
            <button type="button" key={feature.key} className={`hpv31Tab ${idx === active ? 'active' : ''}`} onClick={() => setActive(idx)}>
              {feature.label}
            </button>
          ))}
        </div>
        <article className="hpv31TabPanel">
          <h3>{features[active].label}</h3>
          <p>{features[active].summary}</p>
          <ul>
            {features[active].values.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
