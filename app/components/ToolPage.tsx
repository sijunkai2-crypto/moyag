import Link from 'next/link';

type Props = {
  title: string;
  description: string;
  cta: string;
};

export default function ToolPage({ title, description, cta }: Props) {
  return (
    <main className="hpv32Home hpv32ToolPage">
      <header className="hpv32NavWrap">
        <div className="hpv32Container hpv32Nav">
          <Link href="/" className="hpv32Logo">Moyag AI</Link>
          <nav><Link href="/">Home</Link><Link href="/#seo-tools">SEO Tools</Link><Link href="/#pricing">Pricing</Link></nav>
          <Link href="/#audit-form" className="hpv32MainBtn">Get My Report</Link>
        </div>
      </header>
      <section className="hpv32Section">
        <div className="hpv32Container">
          <p className="hpv32Eyebrow">SEO Tool</p>
          <h1 className="hpv32ToolTitle">{title}</h1>
          <p className="hpv32Muted">{description}</p>
          <Link href="/#audit-form" className="hpv32MainBtn hpv32InlineBtn">{cta}</Link>

          <div className="hpv32ValueGrid">
            <article><i /><h3>Insight Summary</h3><p>Actionable findings for B2B growth teams.</p></article>
            <article><i /><h3>AI estimate</h3><p>Simulated preview now; connect GSC/GA4 for real data later.</p></article>
            <article><i /><h3>Execution Focus</h3><p>Prioritized actions to improve visibility and conversion.</p></article>
          </div>

          <article className="hpv32PreviewCard">
            <h3>Simulated Report Preview</h3>
            <p>Overall SEO Score: 86 · Top Issues: 7 · Organic Traffic: +178% · Keywords Ranked: 3.2K · Backlinks: AI estimate</p>
          </article>
        </div>
      </section>
    </main>
  );
}
