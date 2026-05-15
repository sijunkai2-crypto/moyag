import ToolPage from '../../components/ToolPage';

export default function Page() {
  return <ToolPage name="Domain Gap" summary="比较你与核心竞品在关键词、着陆页和内容主题上的差距并输出优先级。" features={["Keyword Gap Matrix", "Landing Page Gap", "Action Priority"]} metrics={[{ label: 'Domain Gap Index', value: '66' }, { label: 'Keyword Gap', value: '136' }, { label: 'Landing Gaps', value: '17' }]} />;
}
