import ToolPage from '../../components/ToolPage';

export default function Page() {
  return <ToolPage name="Domain Overview" summary="快速理解域名健康度、页面结构和抓取效率，建立 SEO 增长基线。" features={["Site Health Snapshot", "Crawlability Signals", "Visibility Trend"]} metrics={[{ label: 'SEO Score', value: '86/100' }, { label: 'Indexed Pages', value: '1.8K' }, { label: 'Critical Issues', value: '6' }]} />;
}
