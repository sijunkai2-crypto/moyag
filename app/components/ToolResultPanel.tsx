import MetricCard from './MetricCard';

export default function ToolResultPanel({ result }: { result: Record<string, unknown> }) {
  const entries = Object.entries(result || {}).filter(([k]) => k !== 'notice');
  return (
    <div className="hpv32ReportPreview hpv33Panel">
      <h3>Analysis Result</h3>
      <div className="hpv32MetricFloatGrid hpv33MetricGrid">
        {entries.map(([key, value]) => (
          <MetricCard key={key} label={key} value={Array.isArray(value) ? value.join(' · ') : String(value)} />
        ))}
      </div>
      {result.notice ? <p>{String(result.notice)}</p> : null}
    </div>
  );
}
