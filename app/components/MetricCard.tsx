export default function MetricCard({ label, value }: { label: string; value: string | number }) {
  return <article className="hpv33MetricCard"><span>{label}</span><b>{String(value)}</b></article>;
}
