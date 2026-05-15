'use client';

const tools = [
  { href: '/tools/domain-overview', title: 'Domain Overview', desc: 'Site structure and crawl baseline' },
  { href: '/tools/traffic-analysis', title: 'Traffic Analysis', desc: 'AI traffic potential estimate' },
  { href: '/tools/keyword-analysis', title: 'Keyword Analysis', desc: 'Keyword and topic opportunities' },
  { href: '/tools/competitor-compare', title: 'Competitor Compare', desc: 'Side-by-side homepage comparison' },
  { href: '/tools/backlink-check', title: 'Backlink Check', desc: 'External link trust signal estimate' },
  { href: '/tools/market-analysis', title: 'Market Analysis', desc: 'Regional SEO strategy insights' },
  { href: '/tools/domain-gap', title: 'Domain Gap', desc: 'Multi-domain growth gap estimate' }
];

export default function SeoToolCards() {
  return <section className="hpv32Section" id="seo-tools"><div className="hpv32Container"><div className="hpv32SectionHead"><p className="hpv32Eyebrow">SEO Tools</p><h2>Product-grade tool entry</h2></div><div className="hpv33ToolGrid">{tools.map((tool)=><a key={tool.href} href={tool.href} className="hpv33ToolCard"><i /><h3>{tool.title}</h3><p>{tool.desc}</p><b>Open Tool <span>→</span></b></a>)}</div></div></section>;
}
