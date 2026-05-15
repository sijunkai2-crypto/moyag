import ToolPage from '../../components/ToolPage';

export default function Page() {
  return <ToolPage name="Backlink Check" summary="模拟评估外链质量与风险等级，定位更安全的品牌外链增长机会。" features={["Risk Signals", "Referring Domain Mix", "Brand Mentions"]} metrics={[{ label: 'Backlink Risk', value: 'Low-Medium' }, { label: 'Ref Domains', value: '68' }, { label: 'Mention Ops', value: '11' }]} />;
}
