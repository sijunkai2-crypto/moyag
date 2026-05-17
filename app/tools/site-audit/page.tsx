import ToolPage from '../../components/ToolPage';

export default function Page() {
  return <ToolPage name="Site Audit" summary="检测站点健康度、页面结构、索引与抓取问题，帮助快速发现影响 Google SEO 增长的基础障碍。" features={["Technical SEO Health", "Indexing & Crawlability", "Page Structure Issues"]} toolType="domain-overview" />;
}
