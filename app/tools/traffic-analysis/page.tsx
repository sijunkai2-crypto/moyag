import ToolPage from '../../components/ToolPage';

export default function Page() {
  return <ToolPage name="Traffic Analysis" summary="模拟分析自然流量来源、入口页表现与增长波动，为内容策略提供方向。" features={["Organic Trend Estimate", "Top Entry Pages", "Traffic Risk Alerts"]} metrics={[{ label: 'Organic Traffic', value: '+178%' }, { label: 'Top Landing Pages', value: '26' }, { label: 'Risk Level', value: 'Medium' }]} />;
}
