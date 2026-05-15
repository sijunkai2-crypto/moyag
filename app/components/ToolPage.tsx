import ToolAnalyzer from './ToolAnalyzer';

const summaries: Record<string, string> = {
  'domain-overview': 'Analyze homepage technical and content SEO baseline in one view.',
  'traffic-analysis': 'Estimate traffic growth potential by content depth, structure, and CTA signals.',
  'keyword-analysis': 'Extract current keyword signals and generate buyer-intent keyword opportunities.',
  'competitor-compare': 'Compare your homepage SEO fundamentals with a direct competitor.',
  'backlink-check': 'Estimate backlink trust signals from homepage outbound link footprint.',
  'market-analysis': 'Generate market-fit SEO strategy by industry and target market.',
  'domain-gap': 'Estimate gap across your domain and one/two competitors for growth priorities.'
};

export default function ToolPage({ toolType }: { toolType: 'domain-overview' | 'traffic-analysis' | 'keyword-analysis' | 'competitor-compare' | 'backlink-check' | 'market-analysis' | 'domain-gap' }) {
  return (
    <main className="hpv32ToolPage">
      <header className="hpv32ToolNav"><div className="hpv32Container hpv32ToolNavInner"><a href="/" className="hpv32Logo">Moyag AI</a><a href="/" className="hpv32BackHome">← Back Home</a></div></header>
      <section className="hpv32Section"><div className="hpv32Container"><p className="hpv32Eyebrow">AI Tool</p><h1>{toolType}</h1><p>{summaries[toolType]}</p><ToolAnalyzer toolType={toolType} /></div></section>
    </main>
  );
}
