import MetricCard from './MetricCard';

export default function ToolResultPanel({ result }: { result: Record<string, unknown> }) {
  const entries = Object.entries(result || {});
  return (
    <div className="hpv33ResultGrid">
      {entries.map(([k, v]) => {
        const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
        const val = Array.isArray(v) ? v.join(' · ') : typeof v === 'object' ? JSON.stringify(v) : String(v);
        return <MetricCard key={k} label={label} value={val} />;
      })}
    </div>
  );
}
