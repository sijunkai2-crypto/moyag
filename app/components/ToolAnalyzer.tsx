'use client';

import { useState } from 'react';
import ToolResultPanel from './ToolResultPanel';

type ToolType = 'domain-overview' | 'traffic-analysis' | 'keyword-analysis' | 'competitor-compare' | 'backlink-check' | 'market-analysis' | 'domain-gap';

const fieldMap: Record<ToolType, Array<{ name: string; label: string; placeholder: string }>> = {
  'domain-overview': [{ name: 'domain', label: 'Domain', placeholder: 'example.com' }],
  'traffic-analysis': [{ name: 'domain', label: 'Domain', placeholder: 'example.com' }, { name: 'targetMarket', label: 'Target Market', placeholder: 'US / EU / SEA' }],
  'keyword-analysis': [{ name: 'domain', label: 'Domain', placeholder: 'example.com' }, { name: 'product', label: 'Industry / Product', placeholder: 'industrial sensors' }],
  'competitor-compare': [{ name: 'myDomain', label: 'My Domain', placeholder: 'mydomain.com' }, { name: 'competitorDomain', label: 'Competitor Domain', placeholder: 'competitor.com' }],
  'backlink-check': [{ name: 'domain', label: 'Domain', placeholder: 'example.com' }],
  'market-analysis': [{ name: 'domain', label: 'Domain', placeholder: 'example.com' }, { name: 'industry', label: 'Industry', placeholder: 'B2B manufacturing' }, { name: 'targetMarket', label: 'Target Market', placeholder: 'North America' }],
  'domain-gap': [{ name: 'myDomain', label: 'My Domain', placeholder: 'mydomain.com' }, { name: 'competitorDomainA', label: 'Competitor A', placeholder: 'comp-a.com' }, { name: 'competitorDomainB', label: 'Competitor B (Optional)', placeholder: 'comp-b.com' }]
};

export default function ToolAnalyzer({ toolType }: { toolType: ToolType }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true); setError(''); setResult(null); setNotice('');
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch(`/api/tools/${toolType}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      setResult(data.result || {}); setNotice(data.notice || '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="hpv33Glass">
      <form action={onSubmit} className="hpv33ToolForm">
        {fieldMap[toolType].map((f) => (
          <label key={f.name}>{f.label}<input name={f.name} placeholder={f.placeholder} required={!f.label.includes('Optional')} /></label>
        ))}
        <button className="hpv32MainBtn" type="submit">{loading ? 'Analyzing...' : 'Run Analysis'}</button>
      </form>
      <p className="hpv33Hint">AI estimate / simulated preview. Connect GSC/GA4 or third-party SEO data later for real production metrics.</p>
      {error && <p className="formMessage error">{error}</p>}
      {notice && <p className="formMessage success">{notice}</p>}
      {result && <ToolResultPanel result={result} />}
    </div>
  );
}
