export default function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="hpv32FloatCard hpv33MetricCard">
      <span>{label}</span>
      <b>{value}</b>
    </article>
  );
}
