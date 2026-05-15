import ToolPage from '../../components/ToolPage';

export default function Page() {
  return <ToolPage name="Keyword Analysis" summary="发现商业意图关键词机会、长尾词缺口和主题集群覆盖率。" features={["Intent Cluster Map", "Keyword Opportunities", "Content Gap Hints"]} metrics={[{ label: 'Tracked Keywords', value: '3.2K' }, { label: 'Opportunity Terms', value: '42' }, { label: 'Coverage', value: '47%' }]} />;
}
