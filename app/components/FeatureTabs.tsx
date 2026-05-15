'use client';

const features = [
  'Domain architecture and crawl health overview',
  'Keyword opportunity clusters and content roadmap',
  'Competitor and backlink signal comparison'
];

export default function FeatureTabs({ active: _active, setActive: _setActive }: { active: number; setActive: (index: number) => void }) {
  return (
    <section className="hpv32Section">
      <div className="hpv32Container hpv32FeatureMiniGrid">
        {features.map((feature) => (
          <article key={feature} className="hpv32GlassCard"><h3>{feature}</h3><p>AI estimate / simulated preview，接入真实数据后可升级为生产级 SEO 诊断。</p></article>
        ))}
      </div>
    </section>
  );
}
