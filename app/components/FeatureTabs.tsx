'use client';

const features = [
  { key: 'domain', label: 'Domain Overview', summary: 'Unified SEO baseline including technical health and visibility.', values: ['SEO Health: 86', 'Indexability: Stable', 'Opportunity clusters: 6'] },
  { key: 'traffic', label: 'Traffic Analysis', summary: 'AI estimate for organic growth potential from content structure.', values: ['AI estimate: +22%', 'Entry pages: 26', 'Risk: Medium'] },
  { key: 'keyword', label: 'Keyword Analysis', summary: 'High-intent, long-tail and conversion-focused keyword discovery.', values: ['Opportunities: 42', 'Intent coverage: 47%', 'Missing topics: 6'] },
  { key: 'competitor', label: 'Competitor Compare', summary: 'Benchmark competitors in structure, depth and conversion signals.', values: ['Content gap: 14 pages', 'CTA clarity: 61/100', 'Schema gap: Moderate'] },
  { key: 'backlink', label: 'Backlink Check', summary: 'Backlink signals and risk hints with brand mention opportunities.', values: ['Risk: Low-Medium', 'Ref domains: simulated', 'Brand mentions: 11'] },
  { key: 'market', label: 'Market Analysis', summary: 'Market-fit guidance by industry, region and buying stage.', values: ['Market fit: 73/100', 'Localized ratio: 41%', 'Priority market: North America'] },
  { key: 'gap', label: 'Domain Gap', summary: 'Compare domains across keywords, landing pages and paths.', values: ['Domain gap index: 66', 'Keyword gap: 136', 'Landing gap: 17'] }
];

export default function FeatureTabs({ active, setActive }: { active: number; setActive: (index: number) => void }) {
  return (
    <section className="hpv32Section">
      <div className="hpv32Container">
        <h2>Interactive SEO Tools Demo</h2>
        <p className="hpv32Muted">Simulated preview now, connect GSC/GA4 for real data later.</p>
        <div className="hpv32Tabs">{features.map((f, i) => <button type="button" key={f.key} className={`hpv32Tab ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>{f.label}</button>)}</div>
        <article className="hpv32TabPanel"><h3>{features[active].label}</h3><p>{features[active].summary}</p><ul>{features[active].values.map((v) => <li key={v}>{v}</li>)}</ul></article>
      </div>
    </section>
  );
}
