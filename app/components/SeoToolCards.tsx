import Link from 'next/link';

const tools = [
  { title: 'Domain Overview', href: '/tools/domain-overview', desc: 'SEO health, index status, technical issues, growth opportunities.' },
  { title: 'Traffic Analysis', href: '/tools/traffic-analysis', desc: 'AI estimate for organic traffic potential from site structure.' },
  { title: 'Keyword Analysis', href: '/tools/keyword-analysis', desc: 'Commercial intent keywords, long-tail opportunities, content ideas.' },
  { title: 'Competitor Compare', href: '/tools/competitor-compare', desc: 'Compare page structure, keyword coverage, CTA and depth.' },
  { title: 'Backlink Check', href: '/tools/backlink-check', desc: 'Backlink signals, risk hints, and brand mention opportunities.' },
  { title: 'Market Analysis', href: '/tools/market-analysis', desc: 'Market-fit SEO strategy based on industry and target region.' },
  { title: 'Domain Gap', href: '/tools/domain-gap', desc: 'Keyword, landing-page, and conversion-path comparison.' }
];

export default function SeoToolCards() {
  return (
    <div className="hpv32ToolGrid">
      {tools.map((tool) => (
        <Link key={tool.title} href={tool.href} className="hpv32ToolCard">
          <i />
          <h3>{tool.title}</h3>
          <p>{tool.desc}</p>
          <span>Explore →</span>
        </Link>
      ))}
    </div>
  );
}
