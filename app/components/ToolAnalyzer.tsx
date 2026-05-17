'use client';

import { useState } from 'react';
import ToolResultPanel from './ToolResultPanel';

const fields: Record<string, Array<{ name: string; label: string; required?: boolean }>> = {
  'domain-overview': [{ name: 'domain', label: 'Domain', required: true }],
  'traffic-analysis': [{ name: 'domain', label: 'Domain', required: true }, { name: 'targetMarket', label: 'Target Market' }],
  'keyword-analysis': [{ name: 'domain', label: 'Domain', required: true }, { name: 'product', label: 'Product' }, { name: 'industry', label: 'Industry' }],
  'competitor-compare': [{ name: 'myDomain', label: 'My Domain', required: true }, { name: 'competitorDomain', label: 'Competitor Domain', required: true }],
  'backlink-check': [{ name: 'domain', label: 'Domain', required: true }],
  'market-analysis': [{ name: 'domain', label: 'Domain', required: true }, { name: 'industry', label: 'Industry' }, { name: 'targetMarket', label: 'Target Market' }],
  'domain-gap': [{ name: 'myDomain', label: 'My Domain', required: true }, { name: 'competitorDomainA', label: 'Competitor Domain A', required: true }, { name: 'competitorDomainB', label: 'Competitor Domain B (optional)' }]
};

export default function ToolAnalyzer({ toolType }: { toolType: string }) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const run = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const resp = await fetch(`/api/tools/${toolType}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Request failed');
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hpv34AnalyzerCard">
      <div className="hpv34AnalyzerHeader">
        <span className="hpv34AnalyzerIcon">AI</span>
        <div>
          <b>Interactive SEO estimate</b>
          <p>Enter domain information and generate a structured simulated preview.</p>
        </div>
      </div>
      <div className="auditForm hpv33ToolForm hpv34ToolForm">
        {fields[toolType].map((f) => (
          <label key={f.name}>
            {f.label}
            <input
              required={f.required}
              value={form[f.name] || ''}
              onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
              placeholder={f.required ? 'https://example.com' : 'Optional'}
            />
          </label>
        ))}
        <button className="submitBtn hpv34AnalyzeBtn" type="button" onClick={run} disabled={loading}>
          {loading ? 'Analyzing...' : 'Run AI Estimate'}
        </button>
        {error ? <p className="formMessage error">{error}</p> : null}
      </div>
      {result ? <ToolResultPanel result={result} /> : null}
    </div>
  );
}
