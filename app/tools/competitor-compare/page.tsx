import ToolPage from '../../components/ToolPage';

export default function Page() {
  return <ToolPage name="Competitor Compare" summary="对比竞品站点在内容深度、结构和转化路径上的差距，制定超越策略。" features={["Competitor Snapshot", "Content Depth Compare", "CTA Path Gap"]} metrics={[{ label: 'Gap Pages', value: '14' }, { label: 'CTR Potential', value: '+22%' }, { label: 'Schema Gap', value: 'Moderate' }]} />;
}
