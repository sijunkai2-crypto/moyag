import ToolPage from '../../components/ToolPage';

export default function Page() {
  return <ToolPage name="Market Analysis" summary="评估目标市场匹配度与本地化内容成熟度，帮助 B2B 出海站点规划增长市场。" features={["Market Fit Score", "Localization Coverage", "Growth Market Ranking"]} metrics={[{ label: 'Market Fit', value: '73/100' }, { label: 'Localized Pages', value: '41%' }, { label: 'Best Next Market', value: 'North America' }]} />;
}
